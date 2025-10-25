/**
 * Execute SQL to create legal cases tables in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeSQLFile() {
  console.log('📝 Creating legal cases tables in Supabase...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-cases-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('Executing SQL script...');

    // Execute the SQL using rpc (we need to use Supabase's SQL execution method)
    // Note: Supabase doesn't have a direct SQL execution method in the client
    // We'll need to split and execute statements individually

    // Split the SQL into individual statements
    // This is a simple split - might need refinement for complex SQL
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.startsWith('COMMENT')) {
        console.log(`Skipping: ${statement.substring(0, 50)}...`);
        continue;
      }

      console.log(`[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}...`);

      // Execute using raw SQL
      const { error } = await supabase.rpc('exec_sql', { sql_string: statement + ';' });

      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        console.error('Statement:', statement.substring(0, 200));

        // Continue anyway - some errors might be expected (e.g., table already exists)
        if (error.message.includes('already exists')) {
          console.log('   (Table already exists - continuing...)\n');
        } else {
          console.log('   (Continuing anyway...)\n');
        }
      } else {
        console.log('   ✅ Success\n');
      }
    }

    console.log('\n✅ SQL execution completed!');
    console.log('\nYou can now query the tables:');
    console.log('  - cases');
    console.log('  - case_articles');
    console.log('  - case_analysis_steps');
    console.log('  - case_hints');
    console.log('  - cases_complete (view)');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

executeSQLFile();
