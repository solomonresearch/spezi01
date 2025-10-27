#!/usr/bin/env node

/**
 * Get all tables schema from Supabase
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function getAllTablesSchema() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📋 Connecting to database...\n');
    await client.connect();

    // Get all tables in public schema
    const { rows: tables } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│              ALL SUPABASE TABLES                                │');
    console.log('└─────────────────────────────────────────────────────────────────┘\n');

    for (const table of tables) {
      const tableName = table.table_name;

      console.log('═'.repeat(70));
      console.log(`TABLE: ${tableName.toUpperCase()}`);
      console.log('═'.repeat(70));

      // Get columns for this table
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

      columns.forEach((col, idx) => {
        const typeInfo = col.data_type +
          (col.character_maximum_length ? `(${col.character_maximum_length})` : '');

        console.log(`\n${idx + 1}. ${col.column_name}`);
        console.log(`   Type: ${typeInfo}`);
        console.log(`   Nullable: ${col.is_nullable === 'YES' ? '✓' : '✗'}`);

        if (col.column_default) {
          // Truncate long defaults
          const defaultVal = col.column_default.length > 50
            ? col.column_default.substring(0, 50) + '...'
            : col.column_default;
          console.log(`   Default: ${defaultVal}`);
        }

        if (col.column_description) {
          console.log(`   Description: ${col.column_description}`);
        }
      });

      // Get foreign keys
      const { rows: fkeys } = await client.query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1;
      `, [tableName]);

      if (fkeys.length > 0) {
        console.log('\n   🔗 Foreign Keys:');
        fkeys.forEach(fk => {
          console.log(`      ${fk.column_name} → ${fk.foreign_table_name}(${fk.foreign_column_name})`);
        });
      }

      // Get row count
      const { rows: countRows } = await client.query(`
        SELECT COUNT(*) as count FROM ${tableName};
      `);
      console.log(`\n   📊 Total Rows: ${countRows[0].count}`);

      console.log('\n');
    }

    // Summary
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│                        SUMMARY                                  │');
    console.log('└─────────────────────────────────────────────────────────────────┘\n');

    console.log(`Total Tables: ${tables.length}`);
    tables.forEach((t, idx) => {
      console.log(`  ${idx + 1}. ${t.table_name}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✨ Done!\n');
  }
}

getAllTablesSchema();
