#!/usr/bin/env node

/**
 * Debug RLS policies and test INSERT
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function debugRLSPolicies() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔍 Debugging RLS policies for user_profiles...\n');

    // Check if RLS is enabled
    console.log('1. Check if RLS is enabled:');
    const { rows: rlsStatus } = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE tablename = 'user_profiles';
    `);
    console.log(`   RLS enabled: ${rlsStatus[0]?.rowsecurity ? 'YES ✓' : 'NO ✗'}\n`);

    // Check all policies
    console.log('2. Current policies:');
    const { rows: policies } = await client.query(`
      SELECT
        policyname,
        cmd,
        permissive,
        roles,
        qual,
        with_check
      FROM pg_policies
      WHERE tablename = 'user_profiles'
      ORDER BY cmd, policyname;
    `);

    policies.forEach(p => {
      console.log(`\n   Policy: ${p.policyname}`);
      console.log(`   Command: ${p.cmd}`);
      console.log(`   Permissive: ${p.permissive}`);
      console.log(`   Roles: ${p.roles}`);
      console.log(`   USING: ${p.qual || 'none'}`);
      console.log(`   WITH CHECK: ${p.with_check || 'none'}`);
    });

    // Check table owner and permissions
    console.log('\n3. Table ownership and permissions:');
    const { rows: tableInfo } = await client.query(`
      SELECT
        schemaname,
        tablename,
        tableowner
      FROM pg_tables
      WHERE tablename = 'user_profiles';
    `);
    console.log(`   Owner: ${tableInfo[0]?.tableowner}`);
    console.log(`   Schema: ${tableInfo[0]?.schemaname}`);

    // Check grants
    console.log('\n4. Table grants:');
    const { rows: grants } = await client.query(`
      SELECT
        grantee,
        privilege_type
      FROM information_schema.role_table_grants
      WHERE table_name = 'user_profiles'
      ORDER BY grantee, privilege_type;
    `);

    const grantsByRole = {};
    grants.forEach(g => {
      if (!grantsByRole[g.grantee]) {
        grantsByRole[g.grantee] = [];
      }
      grantsByRole[g.grantee].push(g.privilege_type);
    });

    Object.keys(grantsByRole).forEach(role => {
      console.log(`   ${role}: ${grantsByRole[role].join(', ')}`);
    });

    // Check if there are any triggers that might be blocking
    console.log('\n5. Triggers on user_profiles:');
    const { rows: triggers } = await client.query(`
      SELECT
        trigger_name,
        event_manipulation,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'user_profiles';
    `);

    if (triggers.length === 0) {
      console.log('   No triggers found ✓');
    } else {
      triggers.forEach(t => {
        console.log(`   - ${t.trigger_name} (${t.event_manipulation})`);
      });
    }

    console.log('\n✅ Debug information collected!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

debugRLSPolicies();
