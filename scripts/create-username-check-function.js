#!/usr/bin/env node

/**
 * Create case-insensitive username availability check function
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function createUsernameCheckFunction() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Creating case-insensitive username check function...\n');

    // Drop existing function if it exists
    console.log('🗑️  Dropping old function if it exists...');
    await client.query(`
      DROP FUNCTION IF EXISTS is_username_available(text);
    `);

    // Create new case-insensitive function
    console.log('✅ Creating new case-insensitive function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION is_username_available(p_username text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        username_exists boolean;
      BEGIN
        -- Check if username exists (case-insensitive)
        SELECT EXISTS (
          SELECT 1
          FROM user_profiles
          WHERE LOWER(username) = LOWER(p_username)
        ) INTO username_exists;

        -- Return true if username is available (doesn't exist)
        RETURN NOT username_exists;
      END;
      $$;
    `);

    console.log('✅ Function created successfully!\n');

    // Test the function
    console.log('🧪 Testing the function...\n');

    const { rows: testResults } = await client.query(`
      SELECT
        is_username_available('victor') as victor_available,
        is_username_available('Victor') as victor_capital_available,
        is_username_available('VICTOR') as victor_all_caps_available,
        is_username_available('nonexistentuser12345') as new_user_available;
    `);

    console.log('Test results:');
    console.log(`  victor: ${testResults[0].victor_available ? '✅ Available' : '❌ Taken'}`);
    console.log(`  Victor: ${testResults[0].victor_capital_available ? '✅ Available' : '❌ Taken'}`);
    console.log(`  VICTOR: ${testResults[0].victor_all_caps_available ? '✅ Available' : '❌ Taken'}`);
    console.log(`  nonexistentuser12345: ${testResults[0].new_user_available ? '✅ Available' : '❌ Taken'}`);

    console.log('\n✅ Case-insensitive username check function is working!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createUsernameCheckFunction();
