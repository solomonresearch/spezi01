#!/usr/bin/env node

/**
 * Get cases table schema from Supabase
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function getCasesSchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📋 Connecting to database...\n');
    await client.connect();

    // Get table columns with descriptions
    const { rows } = await client.query(`
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default,
        pg_catalog.col_description(
          (SELECT c.oid FROM pg_catalog.pg_class c WHERE c.relname = 'cases' AND c.relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public')),
          ordinal_position
        ) as column_description
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'cases'
      ORDER BY ordinal_position;
    `);

    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│              CASES TABLE STRUCTURE (Supabase)                   │');
    console.log('└─────────────────────────────────────────────────────────────────┘\n');

    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.column_name.toUpperCase()}`);
      console.log(`   Type: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
      console.log(`   Nullable: ${row.is_nullable}`);
      if (row.column_default) {
        console.log(`   Default: ${row.column_default}`);
      }
      if (row.column_description) {
        console.log(`   Description: ${row.column_description}`);
      }
      console.log('');
    });

    // Get a sample case
    const { rows: sampleRows } = await client.query(`
      SELECT * FROM cases LIMIT 1;
    `);

    if (sampleRows.length > 0) {
      console.log('┌─────────────────────────────────────────────────────────────────┐');
      console.log('│                     SAMPLE CASE DATA                            │');
      console.log('└─────────────────────────────────────────────────────────────────┘\n');

      const sample = sampleRows[0];
      for (const [key, value] of Object.entries(sample)) {
        console.log(`${key}:`);
        if (typeof value === 'string' && value.length > 100) {
          console.log(`  ${value.substring(0, 100)}...`);
        } else {
          console.log(`  ${value}`);
        }
        console.log('');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✨ Done!\n');
  }
}

getCasesSchema();
