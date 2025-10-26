#!/usr/bin/env node

/**
 * Display migration and open Supabase SQL Editor
 * Usage: node scripts/show-migration.js path/to/migration.sql
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DASHBOARD_SQL_URL = 'https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new';

async function showMigration() {
  // Get migration file path from command line
  const migrationPath = process.argv[2];

  if (!migrationPath) {
    // If no path provided, show latest migration
    const migrationsDir = 'supabase/migrations';
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error('❌ No migration files found');
      process.exit(1);
    }

    const latestMigration = path.join(migrationsDir, files[0]);
    console.log(`\n📄 Latest migration: ${files[0]}\n`);
    return showMigration.call(null, [null, null, latestMigration]);
  }

  // Check if file exists
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: File not found: ${migrationPath}`);
    process.exit(1);
  }

  // Read migration file
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  const fileName = path.basename(migrationPath);

  console.log('\n' + '='.repeat(70));
  console.log(`📄 Migration: ${fileName}`);
  console.log('='.repeat(70));
  console.log('\n' + migrationSQL + '\n');
  console.log('='.repeat(70));

  console.log('\n✅ Ready to apply migration!');
  console.log('\n📋 Instructions:');
  console.log('   1. Copy the SQL above (Cmd+A, Cmd+C in this terminal)');
  console.log('   2. Browser will open to Supabase SQL Editor');
  console.log('   3. Paste the SQL (Cmd+V)');
  console.log('   4. Click RUN');
  console.log('   5. Verify in Table Editor');

  // Copy to clipboard (Mac)
  try {
    exec(`echo "${migrationSQL.replace(/"/g, '\\"')}" | pbcopy`, (error) => {
      if (!error) {
        console.log('\n📋 ✓ SQL copied to clipboard!');
      }
    });
  } catch (e) {
    // Clipboard failed, no problem
  }

  // Wait a moment, then open browser
  setTimeout(() => {
    console.log(`\n🌐 Opening Supabase SQL Editor...`);
    exec(`open "${DASHBOARD_SQL_URL}"`, (error) => {
      if (error) {
        console.log(`\n   Manual link: ${DASHBOARD_SQL_URL}`);
      }
    });

    // Record migration intent
    const migrationRecord = `${fileName} - Prepared ${new Date().toISOString().split('T')[0]}\n`;
    fs.appendFileSync('supabase/MIGRATIONS_APPLIED.txt', migrationRecord);
  }, 1000);
}

// Run
showMigration();
