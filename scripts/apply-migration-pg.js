#!/usr/bin/env node

/**
 * Apply migration using pg (PostgreSQL client)
 * Usage: node scripts/apply-migration-pg.js
 */

const { Client } = require('pg');
const fs = require('fs');

// Connection string from Supabase
// Format: postgresql://[user]:[password]@[host]:[port]/[database]
const connectionString = process.env.DATABASE_URL ||
  'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function applyMigration() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Supabase requires SSL
    }
  });

  try {
    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read migration file
    const migrationPath = '/Users/v/solomonresearch/spezi01/supabase/migrations/20251027250000_create_submissions_and_conversations.sql';
    console.log(`📄 Reading migration: ${migrationPath.split('/').pop()}`);

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(`📝 Migration size: ${migrationSQL.length} characters\n`);

    console.log('🚀 Executing migration...');

    // Execute the entire migration as one transaction
    const result = await client.query(migrationSQL);

    console.log('✅ Migration executed successfully!');
    console.log(`\n📊 Verify tables at: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/editor\n`);

    // Test that tables were created
    console.log('🔍 Verifying tables...');

    const { rows: submissionsCheck } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'case_submissions'
      );
    `);

    const { rows: conversationsCheck } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'chat_conversations'
      );
    `);

    if (submissionsCheck[0].exists && conversationsCheck[0].exists) {
      console.log('✅ case_submissions table created');
      console.log('✅ chat_conversations table created');
    } else {
      console.log('⚠️  Warning: Tables may not have been created properly');
    }

  } catch (error) {
    console.error('\n❌ Error applying migration:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed\n');
  }
}

applyMigration()
  .then(() => {
    console.log('✨ Done!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  });
