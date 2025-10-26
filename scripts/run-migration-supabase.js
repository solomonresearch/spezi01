const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJobHpwemVnd2Z3Y2Jzcnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM1OTkzOSwiZXhwIjoyMDc2OTM1OTM5fQ.vKvDO3np3ki7pi9d_-p9xRenR2tv-9p6hOvteFANyqI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251026_add_verified_and_case_code.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
  try {
    console.log('Running migration via Supabase client...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      console.error('Migration error:', error);
      throw error;
    }

    console.log('Migration completed successfully!');
    return data;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

runMigration()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
