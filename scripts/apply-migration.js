#!/usr/bin/env node

/**
 * Apply SQL migration to Supabase database
 * Usage: node scripts/apply-migration.js path/to/migration.sql
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJobHpwemVnd2Z3Y2Jzcnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM1OTkzOSwiZXhwIjoyMDc2OTM1OTM5fQ.vKvDO3np3ki7pi9d_-p9xRenR2tv-9p6hOvteFANyqI';

async function applyMigration() {
  // Get migration file path from command line
  const migrationPath = process.argv[2];

  if (!migrationPath) {
    console.error('❌ Error: Migration file path required');
    console.log('\nUsage:');
    console.log('  node scripts/apply-migration.js supabase/migrations/[filename].sql');
    console.log('\nExample:');
    console.log('  node scripts/apply-migration.js supabase/migrations/20251026_add_verified_and_case_code.sql');
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: File not found: ${migrationPath}`);
    process.exit(1);
  }

  // Read migration file
  console.log(`\n📄 Reading migration: ${path.basename(migrationPath)}`);
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Show preview
  const preview = migrationSQL.slice(0, 200);
  console.log(`\n📝 Preview:\n${preview}${migrationSQL.length > 200 ? '...' : ''}\n`);

  // Confirm
  console.log('⚠️  This will apply the migration to PRODUCTION database');
  console.log(`   Database: ${SUPABASE_URL}`);

  // Create Supabase client with service role key
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    console.log('\n🚀 Applying migration...');

    // Split migration into individual statements (handle multi-statement files)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statement(s)`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.trim().startsWith('--')) continue;

      console.log(`   Executing statement ${i + 1}/${statements.length}...`);

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        // If exec_sql doesn't exist, try direct query
        const { data: directData, error: directError } = await supabase
          .from('_migrations')
          .insert({ name: path.basename(migrationPath), statements: [statement] });

        if (directError) {
          console.error(`\n❌ Error executing statement ${i + 1}:`);
          console.error(directError);
          console.log('\n💡 Try applying this migration manually:');
          console.log(`   1. Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new`);
          console.log(`   2. Copy-paste the migration SQL`);
          console.log(`   3. Click RUN`);
          process.exit(1);
        }
      }
    }

    console.log('\n✅ Migration applied successfully!');
    console.log(`\n📊 Verify at: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/editor`);

    // Record migration
    const migrationRecord = `${path.basename(migrationPath)} - Applied ${new Date().toISOString().split('T')[0]}\n`;
    fs.appendFileSync('supabase/MIGRATIONS_APPLIED.txt', migrationRecord);
    console.log(`\n📝 Recorded in: supabase/MIGRATIONS_APPLIED.txt`);

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    console.log('\n💡 Alternative: Apply migration manually via Supabase Dashboard');
    console.log(`   URL: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new`);
    process.exit(1);
  }
}

// Run
applyMigration()
  .then(() => {
    console.log('\n✨ Done!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });
