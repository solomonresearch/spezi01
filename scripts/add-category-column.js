#!/usr/bin/env node

/**
 * Add category column to cases table and prepare for AI classification
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function addCategoryColumn() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔄 Adding category column to cases table...\n');

    // Check if column already exists
    const { rows: columns } = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'cases' AND column_name = 'category';
    `);

    if (columns.length > 0) {
      console.log('✓ Category column already exists');
    } else {
      // Add category column
      await client.query(`
        ALTER TABLE cases
        ADD COLUMN category TEXT;
      `);
      console.log('✓ Category column added successfully');
    }

    // Show current table structure
    console.log('\n📋 Current cases table structure:\n');
    const { rows: tableStructure } = await client.query(`
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'cases'
      ORDER BY ordinal_position;
    `);

    tableStructure.forEach(col => {
      console.log(`  ${col.column_name.padEnd(25)} ${col.data_type.padEnd(15)} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Show sample of current data
    console.log('\n📊 Sample cases (showing category and subcategory):\n');
    const { rows: samples } = await client.query(`
      SELECT
        case_code,
        title,
        category,
        subcategory,
        LEFT(case_description, 100) as description_preview
      FROM cases
      LIMIT 5;
    `);

    samples.forEach(s => {
      console.log(`${s.case_code}: ${s.title}`);
      console.log(`  Category: ${s.category || '(null)'}`);
      console.log(`  Subcategory: ${s.subcategory || '(null)'}`);
      console.log(`  Description: ${s.description_preview}...`);
      console.log('');
    });

    console.log('✅ Done!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addCategoryColumn();
