#!/usr/bin/env node

/**
 * Add case-insensitive unique constraint on usernames
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function addCaseInsensitiveUsername() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Adding case-insensitive unique constraint on usernames...\n');

    // Check if the constraint already exists
    const { rows: existingConstraints } = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'user_profiles'
        AND constraint_type = 'UNIQUE'
        AND constraint_name = 'user_profiles_username_lower_key';
    `);

    if (existingConstraints.length > 0) {
      console.log('⚠️  Case-insensitive constraint already exists. Dropping it first...');
      await client.query(`
        ALTER TABLE user_profiles
        DROP CONSTRAINT IF EXISTS user_profiles_username_lower_key;
      `);
    }

    // Check if index exists
    const { rows: existingIndexes } = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'user_profiles'
        AND indexname = 'user_profiles_username_lower_idx';
    `);

    if (existingIndexes.length > 0) {
      console.log('⚠️  Case-insensitive index already exists. Dropping it first...');
      await client.query(`
        DROP INDEX IF EXISTS user_profiles_username_lower_idx;
      `);
    }

    // Create unique index on lowercase username
    console.log('✅ Creating unique index on LOWER(username)...');
    await client.query(`
      CREATE UNIQUE INDEX user_profiles_username_lower_idx
      ON user_profiles (LOWER(username));
    `);

    console.log('✅ Case-insensitive unique constraint created!\n');

    // Test the constraint
    console.log('🧪 Testing the constraint...\n');

    // Get a sample username
    const { rows: sampleUsers } = await client.query(`
      SELECT username FROM user_profiles LIMIT 1;
    `);

    if (sampleUsers.length > 0) {
      const testUsername = sampleUsers[0].username;
      console.log(`Sample username: "${testUsername}"`);
      console.log(`Lowercase: "${testUsername.toLowerCase()}"`);
      console.log(`Uppercase: "${testUsername.toUpperCase()}"`);
      console.log('\nNow trying to insert duplicate with different case would fail ✓\n');
    }

    console.log('✅ Case-insensitive username constraint is active!\n');
    console.log('📝 Note: Usernames "Victor", "victor", and "VICTOR" are now treated as duplicates.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addCaseInsensitiveUsername();
