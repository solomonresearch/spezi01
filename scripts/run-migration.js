/**
 * Run database migration directly
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  console.log('📋 Running database migration...\n');

  const migrationPath = path.join(__dirname, '../supabase/migrations/20251025_create_law_tutor_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split by semicolon but keep statement context
  const statements = sql
    .split(/;(?=\s*(?:CREATE|INSERT|ALTER|COMMENT|DROP))/i)
    .filter(stmt => stmt.trim().length > 0)
    .map(stmt => stmt.trim() + ';');

  console.log(`Found ${statements.length} SQL statements\n`);

  let success = 0;
  let errors = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];

    // Skip comments
    if (stmt.startsWith('--') || stmt.startsWith('/*')) {
      continue;
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });

      if (error) {
        // Check if table already exists - that's ok
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1}: Already exists (skipping)`);
          success++;
        } else {
          console.error(`❌ Statement ${i + 1} failed:`, error.message.substring(0, 100));
          errors++;
        }
      } else {
        console.log(`✅ Statement ${i + 1}: Success`);
        success++;
      }
    } catch (err) {
      console.error(`❌ Statement ${i + 1} error:`, err.message.substring(0, 100));
      errors++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${success}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total: ${statements.length}`);
}

runMigration().catch(console.error);
