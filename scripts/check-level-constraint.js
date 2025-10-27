#!/usr/bin/env node

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function checkLevelConstraint() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n📋 Checking level constraint on cases table...\n');

    // Get check constraints
    const { rows: constraints } = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'cases'::regclass
        AND contype = 'c';
    `);

    console.log('Check Constraints:');
    constraints.forEach(c => {
      console.log(`\n${c.conname}:`);
      console.log(c.definition);
    });

    // Get sample level values from existing cases
    console.log('\n\n📊 Sample level values from existing cases:');
    const { rows: samples } = await client.query(`
      SELECT DISTINCT level, COUNT(*) as count
      FROM cases
      GROUP BY level
      ORDER BY count DESC;
    `);

    samples.forEach(s => {
      console.log(`  "${s.level}" - ${s.count} cases`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkLevelConstraint();
