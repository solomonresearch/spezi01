#!/usr/bin/env node

/**
 * Reorganize civil law subcategories based on new structure
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

// Mapping of case patterns to subcategories based on content analysis
const SUBCATEGORY_MAPPING = {
  // Keep existing - already correct
  'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)': {
    keep: true,
    caseCodes: [] // Already assigned correctly
  },

  // Consolidate these into main category
  'Persoana fizică (Capacitatea de exercițiu)': {
    keep: true,
    caseCodes: [] // Keep all existing + merge from "Ocrotirea minorului"
  },

  // Move "Ocrotirea minorului" cases to either main or new "Ocrotirea" category
  // Based on HTML, we should keep them separate
  'Persoana fizică (Ocrotirea incapabilului)': {
    newName: true,
    oldName: 'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
    caseCodes: [] // All CIV1A[Q-Z]O cases about tutela
  },

  // For NULL cases and other edge cases
  'Altele': {
    newName: true,
    caseCodes: [] // NULL subcategory cases + edge cases
  }
};

async function reorganizeSubcategories() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔄 Reorganizing Civil Law Subcategories...\n');

    // Step 1: Rename "Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)"
    // to "Persoana fizică (Ocrotirea incapabilului)"
    console.log('1️⃣ Renaming "Ocrotirea minorului" to "Ocrotirea incapabilului"...');
    const { rowCount: renamed } = await client.query(`
      UPDATE cases
      SET subcategory = 'Persoana fizică (Ocrotirea incapabilului)'
      WHERE subcategory = 'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)'
        AND case_code LIKE 'CIV%';
    `);
    console.log(`   ✅ Updated ${renamed} cases\n`);

    // Step 2: Move NULL subcategory cases to "Altele"
    console.log('2️⃣ Moving NULL subcategory cases to "Altele"...');
    const { rowCount: movedNull } = await client.query(`
      UPDATE cases
      SET subcategory = 'Altele'
      WHERE (subcategory IS NULL OR subcategory = '' OR subcategory = 'NULL')
        AND case_code LIKE 'CIV%';
    `);
    console.log(`   ✅ Updated ${movedNull} cases\n`);

    // Step 3: Show final distribution
    console.log('3️⃣ Final subcategory distribution:\n');
    const { rows: distribution } = await client.query(`
      SELECT
        COALESCE(subcategory, 'NULL') as subcategory,
        COUNT(*) as count
      FROM cases
      WHERE case_code LIKE 'CIV%'
      GROUP BY subcategory
      ORDER BY count DESC, subcategory;
    `);

    distribution.forEach((row, idx) => {
      console.log(`   ${idx + 1}. "${row.subcategory}" - ${row.count} cases`);
    });

    console.log('\n✅ Reorganization complete!\n');

    // Show the new structure
    console.log('═'.repeat(80));
    console.log('NEW SUBCATEGORY STRUCTURE FOR CIVIL LAW');
    console.log('═'.repeat(80));
    console.log(`
Available subcategories:

1. Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)
2. Persoana fizică (Capacitatea de exercițiu)
3. Persoana fizică (Ocrotirea incapabilului)
4. Persoana fizică (Elemente de identificare. Starea civilă)
5. Persoana juridică (Noțiune, Capacitate)
6. Persoana juridică (Funcționarea persoanei juridice)
7. Exercitarea drepturilor subiective civile. Abuzul de drept
8. Apărarea drepturilor nepatrimoniale
9. Aplicarea legii civile în timp și spațiu I
10. Aplicarea legii civile în timp și spațiu II
11. Altele

Current usage:
- Categories 1-3: In use (${renamed + movedNull + distribution.find(d => d.subcategory.includes('Capacitatea de exercițiu'))?.count || 0} cases)
- Categories 4-10: Ready for new cases
- Category 11: ${movedNull} edge cases
    `);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

reorganizeSubcategories();
