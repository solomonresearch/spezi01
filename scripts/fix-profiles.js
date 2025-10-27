const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Use service role key for admin access
const supabaseUrl = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY;

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_KEY environment variable not set');
  console.log('Run this script with: SUPABASE_SERVICE_KEY=your_key node scripts/fix-profiles.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251027210000_fix_rls_and_missing_profiles.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing migration...');

    // Execute the SQL using the RPC endpoint
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Error executing migration:', error);

      // Try alternative method: execute statements one by one
      console.log('\nTrying alternative method: executing statements individually...');

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i] + ';';
        console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
        console.log(stmt.substring(0, 100) + '...');

        // Use the from() method with a raw SQL query
        // Note: This won't work for DDL statements, so we'll need to use the REST API directly
      }

      console.log('\nFalling back to direct execution via fetch...');
      await executeViaFetch(sql, serviceRoleKey);

    } else {
      console.log('Migration executed successfully!');
      console.log('Result:', data);
    }

  } catch (error) {
    console.error('Exception:', error);
    process.exit(1);
  }
}

async function executeViaFetch(sql, serviceRoleKey) {
  // Try using Supabase's SQL execution endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('HTTP Error:', response.status, error);

    console.log('\n=== Manual SQL Execution Required ===');
    console.log('Please run the following SQL manually in your Supabase SQL Editor:');
    console.log('URL: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql');
    console.log('\nSQL:');
    console.log(sql);
    console.log('\n=====================================\n');
  } else {
    const result = await response.json();
    console.log('Success via fetch:', result);
  }
}

runMigration();
