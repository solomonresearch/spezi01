#!/usr/bin/env node

/**
 * Analyze existing civil law cases and their subcategories
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

async function analyzeCivilCases() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n📊 Analyzing Civil Law Cases...\n');

    // Get all civil cases
    const { rows: cases } = await client.query(`
      SELECT
        case_code,
        title,
        level,
        subcategory,
        verified,
        week_number
      FROM cases
      WHERE case_code LIKE 'CIV%'
      ORDER BY case_code;
    `);

    console.log(`Total Civil Cases: ${cases.length}\n`);

    // Group by subcategory
    const bySubcategory = {};
    cases.forEach(c => {
      const subcat = c.subcategory || 'NULL';
      if (!bySubcategory[subcat]) {
        bySubcategory[subcat] = [];
      }
      bySubcategory[subcat].push(c);
    });

    console.log('═'.repeat(80));
    console.log('CASES GROUPED BY SUBCATEGORY');
    console.log('═'.repeat(80));

    Object.keys(bySubcategory).sort().forEach(subcat => {
      const casesInSubcat = bySubcategory[subcat];
      console.log(`\n📁 ${subcat} (${casesInSubcat.length} cases)`);
      console.log('─'.repeat(80));

      casesInSubcat.forEach(c => {
        const verified = c.verified ? '✓' : ' ';
        console.log(`  [${verified}] ${c.case_code} - ${c.title.substring(0, 60)}...`);
      });
    });

    // Show unique subcategories
    console.log('\n\n═'.repeat(80));
    console.log('UNIQUE SUBCATEGORIES');
    console.log('═'.repeat(80));
    Object.keys(bySubcategory).sort().forEach((subcat, idx) => {
      console.log(`${idx + 1}. "${subcat}" - ${bySubcategory[subcat].length} cases`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

analyzeCivilCases();
