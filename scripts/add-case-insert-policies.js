#!/usr/bin/env node

/**
 * Add INSERT policies for case-related tables
 * Allows admin users to insert articles, analysis steps, and hints
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function addInsertPolicies() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔒 Adding INSERT RLS policies for case-related tables...\n');

    // 1. Add INSERT policy for case_articles
    console.log('Creating INSERT policy for case_articles...');
    await client.query(`
      CREATE POLICY case_articles_insert_policy ON case_articles
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
      );
    `);
    console.log('✅ case_articles_insert_policy created');

    // 2. Add INSERT policy for case_analysis_steps
    console.log('Creating INSERT policy for case_analysis_steps...');
    await client.query(`
      CREATE POLICY case_analysis_steps_insert_policy ON case_analysis_steps
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
      );
    `);
    console.log('✅ case_analysis_steps_insert_policy created');

    // 3. Add INSERT policy for case_hints
    console.log('Creating INSERT policy for case_hints...');
    await client.query(`
      CREATE POLICY case_hints_insert_policy ON case_hints
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
      );
    `);
    console.log('✅ case_hints_insert_policy created');

    console.log('\n✅ All INSERT policies created successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('already exists')) {
      console.log('\nℹ️  Policies may already exist. Skipping...\n');
    } else {
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

addInsertPolicies();
