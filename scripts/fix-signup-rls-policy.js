#!/usr/bin/env node

/**
 * Fix RLS policy for user_profiles to allow signup
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function fixSignupRLSPolicy() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Fixing RLS policies for user_profiles signup...\n');

    // Check current policies
    console.log('📋 Current policies on user_profiles:');
    const { rows: currentPolicies } = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles';
    `);

    console.log(`Found ${currentPolicies.length} policies:`);
    currentPolicies.forEach(p => {
      console.log(`  - ${p.policyname} (${p.cmd})`);
    });

    // Drop existing INSERT policies if they exist
    console.log('\n🗑️  Dropping old INSERT policies if they exist...');
    await client.query(`
      DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
    `);
    await client.query(`
      DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON user_profiles;
    `);

    // Create new INSERT policy that allows users to create their own profile
    console.log('\n✅ Creating new INSERT policy for signup...');
    await client.query(`
      CREATE POLICY "Enable insert for authenticated users during signup"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
    `);

    console.log('✅ Policy created: Users can insert their own profile during signup\n');

    // Verify the new policy
    const { rows: newPolicies } = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles' AND cmd = 'INSERT';
    `);

    console.log('📋 INSERT policies now:');
    newPolicies.forEach(p => {
      console.log(`  - ${p.policyname}`);
      console.log(`    WITH CHECK: ${p.with_check}`);
    });

    console.log('\n✅ RLS policies fixed for signup!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixSignupRLSPolicy();
