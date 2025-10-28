#!/usr/bin/env node

/**
 * Create secure function for profile creation during signup
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function createProfileCreationFunction() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔧 Creating secure profile creation function...\n');

    // Drop existing function if it exists
    console.log('🗑️  Dropping old function if it exists...');
    await client.query(`
      DROP FUNCTION IF EXISTS create_user_profile(uuid, text, text, text, text, text, text);
    `);

    // Create function with SECURITY DEFINER to bypass RLS
    console.log('✅ Creating secure profile creation function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION create_user_profile(
        p_id uuid,
        p_email text,
        p_name text,
        p_username text,
        p_university_code text,
        p_university_category text,
        p_university_name text
      )
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        INSERT INTO user_profiles (
          id,
          email,
          name,
          username,
          university_code,
          university_category,
          university_name,
          is_admin
        ) VALUES (
          p_id,
          p_email,
          p_name,
          p_username,
          p_university_code,
          p_university_category,
          p_university_name,
          false
        );
      END;
      $$;
    `);

    console.log('✅ Function created successfully!\n');

    // Grant execute permission to anon and authenticated
    console.log('🔐 Granting permissions...');
    await client.query(`
      GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, text, text, text, text, text) TO anon;
    `);
    await client.query(`
      GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, text, text, text, text, text) TO authenticated;
    `);

    console.log('✅ Permissions granted!\n');
    console.log('📝 Note: This function bypasses RLS with SECURITY DEFINER\n');
    console.log('✅ Profile creation function is ready!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createProfileCreationFunction();
