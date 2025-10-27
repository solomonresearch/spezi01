#!/usr/bin/env node

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function checkRLSPolicies() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔒 Checking RLS policies for case-related tables...\n');

    const tables = ['cases', 'case_articles', 'case_analysis_steps', 'case_hints'];

    for (const table of tables) {
      console.log('═'.repeat(70));
      console.log(`TABLE: ${table.toUpperCase()}`);
      console.log('═'.repeat(70));

      // Check if RLS is enabled
      const { rows: rlsStatus } = await client.query(`
        SELECT relname, relrowsecurity
        FROM pg_class
        WHERE relname = $1;
      `, [table]);

      if (rlsStatus.length > 0) {
        console.log(`RLS Enabled: ${rlsStatus[0].relrowsecurity ? 'YES' : 'NO'}`);
      }

      // Get all policies
      const { rows: policies } = await client.query(`
        SELECT
          polname as policy_name,
          polcmd as command,
          CASE polcmd
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT'
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            WHEN '*' THEN 'ALL'
          END as command_type,
          polroles::regrole[] as roles,
          pg_get_expr(polqual, polrelid) as using_expression,
          pg_get_expr(polwithcheck, polrelid) as with_check_expression
        FROM pg_policy
        WHERE polrelid = $1::regclass
        ORDER BY polname;
      `, [table]);

      if (policies.length === 0) {
        console.log('No RLS policies defined\n');
      } else {
        console.log('\nPolicies:');
        policies.forEach((policy, idx) => {
          console.log(`\n${idx + 1}. ${policy.policy_name}`);
          console.log(`   Command: ${policy.command_type}`);
          console.log(`   Roles: ${policy.roles || 'ALL'}`);
          if (policy.using_expression) {
            console.log(`   USING: ${policy.using_expression}`);
          }
          if (policy.with_check_expression) {
            console.log(`   WITH CHECK: ${policy.with_check_expression}`);
          }
        });
        console.log('');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRLSPolicies();
