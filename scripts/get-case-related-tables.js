#!/usr/bin/env node

/**
 * Get case-related tables schema from Supabase
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function getRelatedTablesSchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📋 Connecting to database...\n');
    await client.connect();

    const tables = ['case_analysis_steps', 'case_hints', 'case_articles'];

    for (const tableName of tables) {
      console.log('┌─────────────────────────────────────────────────────────────────┐');
      console.log(`│  ${tableName.toUpperCase().padEnd(61)} │`);
      console.log('└─────────────────────────────────────────────────────────────────┘\n');

      // Get table columns
      const { rows: columns } = await client.query(`
        SELECT
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default,
          pg_catalog.col_description(
            (SELECT c.oid FROM pg_catalog.pg_class c
             WHERE c.relname = $1
             AND c.relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public')),
            ordinal_position
          ) as column_description
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      columns.forEach((row, index) => {
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

      // Get sample data
      const { rows: samples } = await client.query(`
        SELECT * FROM ${tableName} LIMIT 3;
      `);

      if (samples.length > 0) {
        console.log('   📊 Sample Data:\n');
        samples.forEach((sample, idx) => {
          console.log(`   Sample ${idx + 1}:`);
          for (const [key, value] of Object.entries(sample)) {
            if (key !== 'id' && key !== 'created_at' && key !== 'case_id') {
              console.log(`      ${key}: ${value}`);
            }
          }
          console.log('');
        });
      }

      console.log('\n');
    }

    // Show how they relate to cases
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│                  RELATIONSHIP TO CASES                          │');
    console.log('└─────────────────────────────────────────────────────────────────┘\n');

    const { rows: exampleCase } = await client.query(`
      SELECT
        c.case_code,
        c.title,
        (SELECT COUNT(*) FROM case_articles WHERE case_id = c.id) as article_count,
        (SELECT COUNT(*) FROM case_analysis_steps WHERE case_id = c.id) as steps_count,
        (SELECT COUNT(*) FROM case_hints WHERE case_id = c.id) as hints_count
      FROM cases c
      WHERE EXISTS (SELECT 1 FROM case_articles WHERE case_id = c.id)
      LIMIT 1;
    `);

    if (exampleCase.length > 0) {
      const example = exampleCase[0];
      console.log(`Example Case: ${example.case_code} - ${example.title}`);
      console.log(`   → ${example.article_count} relevant articles`);
      console.log(`   → ${example.steps_count} analysis steps`);
      console.log(`   → ${example.hints_count} hints`);
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✨ Done!\n');
  }
}

getRelatedTablesSchema();
