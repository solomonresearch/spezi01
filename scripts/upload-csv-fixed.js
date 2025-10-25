/**
 * Upload Civil Code CSV to Supabase - Fixed version with proper CSV parsing
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your_key node scripts/upload-csv-fixed.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadCSV() {
  console.log('📖 Reading CSV file...\n');

  const csvPath = path.join(__dirname, '../Laws/codul_civil.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV properly (handles multiline fields)
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });

  console.log(`📊 Found ${records.length} articles in CSV\n`);

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  const { error: deleteError } = await supabase
    .from('code_articles')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.warn('⚠️  Warning clearing data:', deleteError.message);
  } else {
    console.log('✅ Existing data cleared\n');
  }

  // Upload in batches
  console.log('📤 Uploading articles...\n');

  const BATCH_SIZE = 50;
  let uploaded = 0;
  let errors = 0;

  // Insert one by one to skip duplicates
  for (let i = 0; i < records.length; i++) {
    const row = records[i];

    const dbRecord = {
      code_type: 'civil_code',
      article_number: row.article_number || '',
      article_title: row.article_title || null,
      article_text: row.article_text || '',
      book: row.book || null,
      title: row.title || null,
      chapter: row.chapter || null,
      section: row.section || null,
      annotations: row.annotations || null
    };

    const { data, error} = await supabase
      .from('code_articles')
      .insert([dbRecord]);

    if (error) {
      if (error.message.includes('duplicate key')) {
        // Skip duplicates silently
        errors++;
      } else {
        console.error(`❌ Article ${row.article_number}:`, error.message.substring(0, 60));
        errors++;
      }
    } else {
      uploaded++;
    }

    if ((i + 1) % 100 === 0 || i === records.length - 1) {
      console.log(`✅ Progress: ${uploaded} uploaded, ${errors} skipped/errors - ${i + 1}/${records.length} processed`);
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${uploaded} articles`);
  console.log(`   ❌ Errors: ${errors} articles`);
  console.log(`   📝 Total: ${records.length} articles`);

  if (uploaded === records.length) {
    console.log('\n🎉 All articles uploaded successfully!');
  }
}

// Main
console.log('🚀 Civil Code CSV Uploader (Fixed)\n');
console.log('='.repeat(50) + '\n');

uploadCSV().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
