#!/usr/bin/env node

/**
 * Fix all RLS policies for user_profiles table
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function fixAllRLSPolicies() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Fixing ALL RLS policies for user_profiles...\n');

    // Show current policies
    console.log('📋 Current policies:');
    const { rows: currentPolicies } = await client.query(`
      SELECT policyname, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles';
    `);

    currentPolicies.forEach(p => {
      console.log(`  - ${p.policyname} (${p.cmd})`);
      if (p.with_check) console.log(`    WITH CHECK: ${p.with_check}`);
    });

    // Drop ALL existing policies
    console.log('\n🗑️  Dropping ALL existing policies...');
    for (const policy of currentPolicies) {
      await client.query(`
        DROP POLICY IF EXISTS "${policy.policyname}" ON user_profiles;
      `);
      console.log(`  ✓ Dropped: ${policy.policyname}`);
    }

    // Create clean set of policies
    console.log('\n✅ Creating clean set of policies...\n');

    // 1. SELECT policy - users can view all profiles
    console.log('1. SELECT policy - users can view all profiles');
    await client.query(`
      CREATE POLICY "user_profiles_select_policy"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (true);
    `);

    // 2. INSERT policy - users can insert their own profile during signup
    console.log('2. INSERT policy - users can insert their own profile');
    await client.query(`
      CREATE POLICY "user_profiles_insert_policy"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
    `);

    // 3. UPDATE policy - users can update their own profile
    console.log('3. UPDATE policy - users can update their own profile');
    await client.query(`
      CREATE POLICY "user_profiles_update_policy"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
    `);

    // 4. DELETE policy - users can delete their own profile
    console.log('4. DELETE policy - users can delete their own profile\n');
    await client.query(`
      CREATE POLICY "user_profiles_delete_policy"
      ON user_profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = id);
    `);

    // Verify new policies
    console.log('📋 New policies created:');
    const { rows: newPolicies } = await client.query(`
      SELECT policyname, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles'
      ORDER BY cmd, policyname;
    `);

    newPolicies.forEach(p => {
      console.log(`  ✓ ${p.policyname} (${p.cmd})`);
    });

    console.log('\n✅ All RLS policies fixed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixAllRLSPolicies();
