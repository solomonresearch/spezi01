/**
 * Execute the cases tables migration using pg library
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('📝 Connecting to Supabase database...\n');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../supabase/migrations/20251025214116_create_cases_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('Executing migration SQL...\n');

    // Execute the entire SQL file
    await client.query(sql);

    console.log('✅ Migration completed successfully!\n');
    console.log('Created tables:');
    console.log('  - cases');
    console.log('  - case_articles');
    console.log('  - case_analysis_steps');
    console.log('  - case_hints');
    console.log('  - cases_complete (view)');
    console.log('\nExample case inserted: Caz 1: Cumpărarea unei biciclete');

  } catch (error) {
    console.error('❌ Error executing migration:', error.message);
    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Tables may already exist. This is OK if running migration again.');
    }
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
