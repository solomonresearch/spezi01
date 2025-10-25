/**
 * Setup database tables using PostgreSQL client
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const client = new Client({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.pgprhlzpzegwfwcbsrww',
  password: '3S_LRQm!gnJf3V$',
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  console.log('🔌 Connecting to Supabase database...\n');

  try {
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📋 Executing SQL script...\n');

    // Execute the SQL
    const result = await client.query(sql);

    console.log('✅ Database setup completed successfully!');
    console.log('\nTables created:');
    console.log('  - code_types');
    console.log('  - code_articles');
    console.log('\nIndexes created for fast searching:');
    console.log('  - Article number index');
    console.log('  - Code type index');
    console.log('  - Keywords GIN index');
    console.log('  - Full-text search index (Romanian)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

setupDatabase();
