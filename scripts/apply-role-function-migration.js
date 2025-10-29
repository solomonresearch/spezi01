// Script to apply user role update function migration
// Run with: node scripts/apply-role-function-migration.js

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase connection details
const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function applyMigration() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('📖 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251028_add_update_user_role_function.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    console.log('✅ Migration file loaded\n');

    console.log('🚀 Applying migration to Supabase...\n');

    // Execute the migration
    await client.query(migrationSQL);
    console.log('✅ Migration applied successfully!\n');

    // Test the function exists
    console.log('📊 Verifying function was created...');
    const result = await client.query(`
      SELECT
        p.proname as function_name,
        pg_get_function_identity_arguments(p.oid) as arguments
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = 'update_user_role'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Function verified!');
      console.table(result.rows);
    } else {
      console.log('⚠️ Function not found!');
    }

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed');
  }
}

applyMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
