#!/usr/bin/env node

/**
 * Apply feedback table migration
 * Usage: node scripts/apply-feedback-migration.js
 */

const { Client } = require('pg');
const fs = require('fs');

// Connection string from Supabase
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
    const migrationPath = '/Users/v/solomonresearch/spezi01/supabase/migrations/20251028_create_feedback_table.sql';
    console.log(`📄 Reading migration: ${migrationPath.split('/').pop()}`);

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(`📝 Migration size: ${migrationSQL.length} characters\n`);

    console.log('🚀 Executing migration...');

    // Execute the entire migration as one transaction
    await client.query(migrationSQL);

    console.log('✅ Migration executed successfully!');

    // Test that table was created
    console.log('🔍 Verifying feedback table...');

    const { rows: feedbackCheck } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
      );
    `);

    if (feedbackCheck[0].exists) {
      console.log('✅ feedback table created successfully');

      // Check columns
      const { rows: columns } = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
        ORDER BY ordinal_position;
      `);

      console.log('\n📊 Table columns:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    } else {
      console.log('⚠️  Warning: feedback table was not created');
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
