/**
 * Parse and Upload Civil Code directly to Supabase
 * Skips CSV to avoid multiline field parsing issues
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your_key node scripts/upload-direct.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseCivilCode() {
  console.log('📖 Reading civil code file...\n');

  const inputPath = path.join(__dirname, '../Laws/codcivil.txt');
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');

  const articles = [];
  let currentArticle = null;
  let currentBook = '';
  let currentTitle = '';
  let currentChapter = '';
  let currentSection = '';
  let pendingAnnotation = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Detect structure hierarchy
    if (line.match(/^CARTEA\s+/i) || line.match(/^Cartea\s+/)) {
      currentBook = line;
      continue;
    }

    if (line.match(/^Titlul\s+/i)) {
      currentTitle = line;
      continue;
    }

    if (line.match(/^Capitolul\s+/i)) {
      currentChapter = line;
      continue;
    }

    if (line.match(/^Secţiunea\s+/i) || line.match(/^Secțiunea\s+/i)) {
      currentSection = line;
      continue;
    }

    // Detect article start - must be "Articolul" followed by number, not just "(number)"
    const articleMatch = line.match(/^Articolul\s+(\d+(?:\^\d+)?)\s*$/i);
    if (articleMatch) {
      // Save previous article with its annotation
      if (currentArticle) {
        if (pendingAnnotation) {
          currentArticle.annotations = pendingAnnotation.trim();
          pendingAnnotation = '';
        }
        articles.push(currentArticle);
      }

      // Start new article
      currentArticle = {
        article_number: articleMatch[1].replace('^', ''),
        article_title: '',
        article_text: '',
        book: currentBook,
        title: currentTitle,
        chapter: currentChapter,
        section: currentSection,
        annotations: ''
      };
      continue;
    }

    // Detect annotations (Notă)
    if (line.startsWith('Notă') || line.startsWith('Nota')) {
      // Start collecting annotation
      pendingAnnotation = line + '\n';
      continue;
    }

    // If we're collecting an annotation
    if (pendingAnnotation && !currentArticle) {
      pendingAnnotation += line + '\n';
      continue;
    }

    // If we're in an article
    if (currentArticle) {
      // First meaningful line after article number is the title
      if (!currentArticle.article_title && !line.match(/^\(?(\d+|\w)\)?/) && line.length > 3) {
        currentArticle.article_title = line;
      } else {
        // Everything else is article text
        currentArticle.article_text += line + '\n';
      }
    }
  }

  // Don't forget last article
  if (currentArticle) {
    if (pendingAnnotation) {
      currentArticle.annotations = pendingAnnotation.trim();
    }
    articles.push(currentArticle);
  }

  console.log(`✅ Parsed ${articles.length} articles\n`);
  return articles;
}

async function uploadToSupabase(articles) {
  console.log('🗑️  Clearing existing civil code data...');

  // Clear existing data
  const { error: deleteError } = await supabase
    .from('code_articles')
    .delete()
    .eq('code_type', 'civil_code');

  if (deleteError) {
    console.warn('⚠️  Warning clearing data:', deleteError.message);
  } else {
    console.log('✅ Existing data cleared\n');
  }

  console.log('📤 Uploading articles to Supabase...\n');

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  // Upload one by one for better error handling
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];

    const dbRecord = {
      code_type: 'civil_code',
      article_number: article.article_number,
      article_title: article.article_title || null,
      article_text: article.article_text.trim(),
      book: article.book || null,
      title: article.title || null,
      chapter: article.chapter || null,
      section: article.section || null,
      annotations: article.annotations || null
    };

    const { error } = await supabase
      .from('code_articles')
      .insert([dbRecord]);

    if (error) {
      if (error.message.includes('duplicate key')) {
        skipped++;
      } else {
        console.error(`❌ Article ${article.article_number}:`, error.message.substring(0, 80));
        errors++;
      }
    } else {
      uploaded++;
    }

    // Progress update every 100 articles
    if ((i + 1) % 100 === 0 || i === articles.length - 1) {
      console.log(`✅ Progress: ${uploaded} uploaded, ${skipped} duplicates, ${errors} errors - ${i + 1}/${articles.length} processed`);
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${uploaded} articles`);
  console.log(`   ⏭️  Skipped (duplicates): ${skipped} articles`);
  console.log(`   ❌ Errors: ${errors} articles`);
  console.log(`   📝 Total processed: ${articles.length} articles`);

  if (uploaded === articles.length) {
    console.log('\n🎉 All articles uploaded successfully!');
  }

  return { uploaded, skipped, errors };
}

// Main
console.log('🚀 Civil Code Direct Uploader\n');
console.log('='.repeat(50) + '\n');

(async () => {
  try {
    const articles = parseCivilCode();

    // Show sample
    console.log('📋 Sample Article:');
    console.log(`   Article ${articles[0].article_number}: ${articles[0].article_title}`);
    console.log(`   Text length: ${articles[0].article_text.length} chars`);
    console.log(`   Hierarchy: ${articles[0].book || 'N/A'}\n`);

    const result = await uploadToSupabase(articles);

    if (result.uploaded > 0) {
      console.log('\n✅ Upload complete! Verifying in database...');

      const { count, error } = await supabase
        .from('code_articles')
        .select('*', { count: 'exact', head: true })
        .eq('code_type', 'civil_code');

      if (!error) {
        console.log(`📊 Database verification: ${count} articles in code_articles table`);
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
})();
