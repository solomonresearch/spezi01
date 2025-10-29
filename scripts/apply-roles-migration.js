// Script to apply user roles migration to Supabase
// Run with: node scripts/apply-roles-migration.js

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
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251028_add_user_roles.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    console.log('✅ Migration file loaded\n');

    console.log('🚀 Applying migration to Supabase...\n');

    // Execute the entire migration as a single transaction
    try {
      await client.query('BEGIN');
      await client.query(migrationSQL);
      await client.query('COMMIT');
      console.log('✅ Migration applied successfully!\n');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    // Verify the migration
    console.log('📊 Verifying migration...');
    const result = await client.query(
      'SELECT id, name, username, is_admin, role FROM public.user_profiles LIMIT 5'
    );

    console.log('✅ Migration verified! Sample users:');
    console.table(result.rows);

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
