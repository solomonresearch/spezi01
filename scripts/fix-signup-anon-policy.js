#!/usr/bin/env node

/**
 * Add INSERT policy for anon role during signup
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function fixSignupAnonPolicy() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Adding INSERT policy for anon role during signup...\n');

    // Drop existing anon policy if exists
    console.log('🗑️  Dropping old anon policy if it exists...');
    await client.query(`
      DROP POLICY IF EXISTS "user_profiles_insert_anon_policy" ON user_profiles;
    `);

    // Create INSERT policy for anon role (used during signup)
    console.log('✅ Creating INSERT policy for anon role...');
    await client.query(`
      CREATE POLICY "user_profiles_insert_anon_policy"
      ON user_profiles
      FOR INSERT
      TO anon
      WITH CHECK (true);
    `);

    console.log('✅ Policy created for anon role!\n');

    // Show all INSERT policies
    console.log('📋 All INSERT policies now:');
    const { rows: policies } = await client.query(`
      SELECT
        policyname,
        roles,
        with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles' AND cmd = 'INSERT'
      ORDER BY policyname;
    `);

    policies.forEach(p => {
      console.log(`  - ${p.policyname}`);
      console.log(`    Roles: ${p.roles}`);
      console.log(`    WITH CHECK: ${p.with_check}`);
    });

    console.log('\n✅ Signup should work now!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixSignupAnonPolicy();
