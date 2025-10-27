#!/usr/bin/env node

/**
 * Verify AI classification results in database
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function verifyClassification() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n📊 Verification of AI Classification Results\n');
    console.log('═'.repeat(80));

    // Check overall statistics
    const { rows: stats } = await client.query(`
      SELECT
        COUNT(*) as total_cases,
        COUNT(category) as cases_with_category,
        COUNT(subcategory) as cases_with_subcategory
      FROM cases
      WHERE case_code LIKE 'CIV%';
    `);

    console.log('\nOverall Statistics:');
    console.log(`  Total civil cases: ${stats[0].total_cases}`);
    console.log(`  Cases with category: ${stats[0].cases_with_category}`);
    console.log(`  Cases with subcategory: ${stats[0].cases_with_subcategory}`);

    // Distribution by category
    console.log('\n📋 Distribution by Category:\n');
    const { rows: byCategory } = await client.query(`
      SELECT
        category,
        COUNT(*) as count
      FROM cases
      WHERE case_code LIKE 'CIV%'
      GROUP BY category
      ORDER BY count DESC, category;
    `);

    byCategory.forEach((row, idx) => {
      console.log(`  ${(idx + 1).toString().padStart(2)}. ${(row.category || '(null)').padEnd(50)} ${row.count.toString().padStart(3)} cases`);
    });

    // Distribution by subcategory
    console.log('\n📋 Distribution by Subcategory:\n');
    const { rows: bySubcategory } = await client.query(`
      SELECT
        subcategory,
        COUNT(*) as count
      FROM cases
      WHERE case_code LIKE 'CIV%'
      GROUP BY subcategory
      ORDER BY count DESC, subcategory
      LIMIT 15;
    `);

    bySubcategory.forEach((row, idx) => {
      console.log(`  ${(idx + 1).toString().padStart(2)}. ${(row.subcategory || '(null)').padEnd(65)} ${row.count.toString().padStart(3)} cases`);
    });

    // Sample cases with category and subcategory
    console.log('\n📝 Sample of Classified Cases:\n');
    const { rows: samples } = await client.query(`
      SELECT
        case_code,
        LEFT(title, 50) as title,
        category,
        LEFT(subcategory, 60) as subcategory
      FROM cases
      WHERE case_code LIKE 'CIV%'
      ORDER BY category, subcategory
      LIMIT 10;
    `);

    samples.forEach(s => {
      console.log(`${s.case_code}: ${s.title}`);
      console.log(`  Category: ${s.category || '(null)'}`);
      console.log(`  Subcategory: ${s.subcategory || '(null)'}`);
      console.log('');
    });

    console.log('✅ Verification complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyClassification();
