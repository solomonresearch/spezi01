#!/usr/bin/env node

/**
 * Apply submissions and conversations migration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJobHpwemVnd2Z3Y2Jzcnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM1OTkzOSwiZXhwIjoyMDc2OTM1OTM5fQ.vKvDO3np3ki7pi9d_-p9xRenR2tv-9p6hOvteFANyqI';

async function applyMigration() {
  console.log('\n🚀 Applying submissions migration...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    // Read migration file
    const migrationSQL = fs.readFileSync(
      '/Users/v/solomonresearch/spezi01/supabase/migrations/20251027250000_create_submissions_and_conversations.sql',
      'utf8'
    );

    // For Supabase, we need to use the SQL editor or apply via REST API
    // Since direct SQL execution isn't available via JS client, we'll provide instructions

    console.log('📋 Migration SQL ready to apply');
    console.log('📄 File: supabase/migrations/20251027250000_create_submissions_and_conversations.sql');
    console.log('\n⚠️  Please apply this migration via Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new');
    console.log('   2. Copy the migration SQL from the file above');
    console.log('   3. Paste it into the SQL editor');
    console.log('   4. Click "RUN"');
    console.log('\n💡 Alternatively, I can test table creation using individual queries...\n');

    // Test by trying to select from the tables (will fail if they don't exist)
    console.log('🔍 Testing if tables already exist...');

    const { data: submissionsTest, error: submissionsError } = await supabase
      .from('case_submissions')
      .select('id')
      .limit(1);

    if (submissionsError && submissionsError.code === '42P01') {
      console.log('❌ case_submissions table does not exist yet');
      console.log('\n📝 Outputting migration SQL for manual application:\n');
      console.log('━'.repeat(80));
      console.log(migrationSQL);
      console.log('━'.repeat(80));
      console.log('\n✅ Copy the SQL above and run it in Supabase Dashboard SQL editor');
      return false;
    } else if (submissionsError) {
      console.log('❌ Error checking case_submissions:', submissionsError.message);
      return false;
    } else {
      console.log('✅ case_submissions table already exists');
    }

    const { data: conversationsTest, error: conversationsError } = await supabase
      .from('chat_conversations')
      .select('id')
      .limit(1);

    if (conversationsError && conversationsError.code === '42P01') {
      console.log('❌ chat_conversations table does not exist yet');
      return false;
    } else if (conversationsError) {
      console.log('❌ Error checking chat_conversations:', conversationsError.message);
      return false;
    } else {
      console.log('✅ chat_conversations table already exists');
    }

    console.log('\n✅ All tables exist! Migration already applied.');
    return true;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

applyMigration()
  .then((success) => {
    if (success) {
      console.log('\n✨ Tables are ready!\n');
    } else {
      console.log('\n⚠️  Please apply migration manually via Supabase Dashboard\n');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });
