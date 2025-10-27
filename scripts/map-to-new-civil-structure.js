#!/usr/bin/env node

/**
 * Map existing civil cases to new comprehensive category structure
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

// New comprehensive structure
const CIVIL_LAW_CATEGORIES = {
  'persoane_fizice': {
    name: 'Persoane fizice',
    subcategories: [
      'Capacitatea de folosință',
      'Capacitatea de exercițiu',
      'Incapacități și interdicții',
      'Domiciliul și reședința',
      'Declararea morții și dispariția'
    ]
  },
  'persoane_juridice': {
    name: 'Persoane juridice',
    subcategories: [
      'Asociații și fundații',
      'Fuziune și divizare',
      'Dizolvare și lichidare',
      'Organe de conducere',
      'Patrimoniul persoanei juridice'
    ]
  }
  // ... (other categories)
};

// Mapping rules based on case content analysis
const MAPPING_RULES = {
  // Existing "Capacitatea de folosință" cases -> Persoane fizice / Capacitatea de folosință
  'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)': {
    category: 'Persoane fizice',
    subcategory: 'Capacitatea de folosință'
  },

  // Existing "Capacitatea de exercițiu" cases -> Persoane fizice / Capacitatea de exercițiu
  'Persoana fizică (Capacitatea de exercițiu)': {
    category: 'Persoane fizice',
    subcategory: 'Capacitatea de exercițiu'
  },

  // Existing "Ocrotirea incapabilului" cases -> Persoane fizice / Incapacități și interdicții
  'Persoana fizică (Ocrotirea incapabilului)': {
    category: 'Persoane fizice',
    subcategory: 'Incapacități și interdicții'
  },

  // "Altele" stays as is
  'Altele': {
    category: 'Altele',
    subcategory: null
  }
};

async function mapToNewStructure() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔄 Mapping civil cases to new structure...\n');

    // Get all civil cases
    const { rows: cases } = await client.query(`
      SELECT case_code, title, subcategory
      FROM cases
      WHERE case_code LIKE 'CIV%'
      ORDER BY subcategory, case_code;
    `);

    console.log(`Total civil cases: ${cases.length}\n`);

    // Group by old subcategory
    const byOldSubcat = {};
    cases.forEach(c => {
      const subcat = c.subcategory || 'NULL';
      if (!byOldSubcat[subcat]) byOldSubcat[subcat] = [];
      byOldSubcat[subcat].push(c);
    });

    console.log('═'.repeat(80));
    console.log('MAPPING PLAN');
    console.log('═'.repeat(80));

    let updates = [];

    Object.keys(byOldSubcat).forEach(oldSubcat => {
      const casesInSubcat = byOldSubcat[oldSubcat];
      const mapping = MAPPING_RULES[oldSubcat];

      if (mapping) {
        const newSubcat = mapping.subcategory
          ? `${mapping.category} (${mapping.subcategory})`
          : mapping.category;

        console.log(`\n📁 ${oldSubcat} → ${newSubcat}`);
        console.log(`   ${casesInSubcat.length} cases will be updated`);

        updates.push({
          oldSubcat,
          newSubcat,
          count: casesInSubcat.length
        });
      }
    });

    console.log('\n\n═'.repeat(80));
    console.log('EXECUTING UPDATES');
    console.log('═'.repeat(80));

    for (const update of updates) {
      console.log(`\nUpdating "${update.oldSubcat}" → "${update.newSubcat}"...`);

      const { rowCount } = await client.query(`
        UPDATE cases
        SET subcategory = $1
        WHERE subcategory = $2
          AND case_code LIKE 'CIV%';
      `, [update.newSubcat, update.oldSubcat]);

      console.log(`   ✅ Updated ${rowCount} cases`);
    }

    // Show final distribution
    console.log('\n\n═'.repeat(80));
    console.log('FINAL DISTRIBUTION');
    console.log('═'.repeat(80));

    const { rows: distribution } = await client.query(`
      SELECT
        subcategory,
        COUNT(*) as count
      FROM cases
      WHERE case_code LIKE 'CIV%'
      GROUP BY subcategory
      ORDER BY count DESC, subcategory;
    `);

    distribution.forEach((row, idx) => {
      console.log(`${idx + 1}. "${row.subcategory}" - ${row.count} cases`);
    });

    console.log('\n✅ Mapping complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

mapToNewStructure();
