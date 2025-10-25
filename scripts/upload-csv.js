/**
 * Upload Civil Code CSV to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your_key node scripts/upload-csv.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);
  return result;
}

async function uploadCSV() {
  console.log('📖 Reading CSV file...\n');

  const csvPath = path.join(__dirname, '../Laws/codul_civil.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  // Skip header
  const header = lines[0];
  const dataLines = lines.slice(1);

  console.log(`📊 Found ${dataLines.length} articles in CSV\n`);

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  const { error: deleteError } = await supabase
    .from('code_articles')
    .delete()
    .eq('code_type', 'civil_code');

  if (deleteError) {
    console.warn('⚠️  Warning clearing data:', deleteError.message);
  } else {
    console.log('✅ Existing data cleared\n');
  }

  // Parse and upload
  console.log('📤 Uploading articles...\n');

  const BATCH_SIZE = 50;
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < dataLines.length; i += BATCH_SIZE) {
    const batch = dataLines.slice(i, i + BATCH_SIZE);

    const records = batch.map(line => {
      const [article_number, article_title, article_text, book, title, chapter, section, annotations] = parseCSVLine(line);

      return {
        code_type: 'civil_code',
        article_number: article_number,
        article_title: article_title || null,
        article_text: article_text,
        book: book || null,
        title: title || null,
        chapter: chapter || null,
        section: section || null,
        annotations: annotations || null
      };
    });

    const { data, error } = await supabase
      .from('code_articles')
      .insert(records);

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message.substring(0, 100));
      errors += batch.length;
    } else {
      uploaded += batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(dataLines.length / BATCH_SIZE)} - Uploaded ${uploaded}/${dataLines.length} articles`);
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${uploaded} articles`);
  console.log(`   ❌ Errors: ${errors} articles`);
  console.log(`   📝 Total: ${dataLines.length} articles`);

  if (uploaded === dataLines.length) {
    console.log('\n🎉 All articles uploaded successfully!');
  }
}

// Main
console.log('🚀 Civil Code CSV Uploader\n');
console.log('='.repeat(50) + '\n');

uploadCSV().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
