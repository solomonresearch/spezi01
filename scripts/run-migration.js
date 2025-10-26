const fs = require('fs');
const path = require('path');

// Read the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251026_add_verified_and_case_code.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Database configuration
const dbConfig = {
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.pgprhlzpzegwfwcbsrww',
  password: '3S_LRQm!gnJf3V$'
};

// Using pg library
const { Client } = require('pg');

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Running migration...');
    await client.query(migrationSQL);
    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Connection closed.');
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
