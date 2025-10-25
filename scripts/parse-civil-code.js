/**
 * Civil Code Parser and Uploader
 * Parses Romanian Civil Code from text file and uploads to Supabase
 * Optimized for fast searchability with proper indexing
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service key for admin operations

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your_key node scripts/parse-civil-code.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// File path
const CIVIL_CODE_PATH = path.join(__dirname, '../Laws/codcivil.txt');

/**
 * Parse civil code file into structured articles
 */
function parseCivilCode(filePath) {
  console.log('📖 Reading civil code from:', filePath);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const articles = [];
  let currentArticle = null;
  let currentBook = null;
  let currentTitle = null;
  let currentChapter = null;
  let bookNumber = null;
  let titleNumber = null;
  let chapterNumber = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Match Book: "CARTEA I" or "CARTEA ÎNTÂI"
    const bookMatch = line.match(/^CARTEA\s+([IVX]+|ÎNTÂI|A DOUA|A TREIA|A PATRA|A CINCEA|A ȘASEA|A ȘAPTEA)/i);
    if (bookMatch) {
      currentBook = line;
      bookNumber = parseRomanOrWord(bookMatch[1]);
      continue;
    }

    // Match Title: "Titlul I" or "Titlul PRELIMINAR"
    const titleMatch = line.match(/^Titlul\s+([IVX]+|PRELIMINAR)/i);
    if (titleMatch) {
      currentTitle = line;
      titleNumber = parseRomanOrWord(titleMatch[1]);
      continue;
    }

    // Match Chapter: "Capitolul I"
    const chapterMatch = line.match(/^Capitolul\s+([IVX]+)/i);
    if (chapterMatch) {
      currentChapter = line;
      chapterNumber = parseRomanOrWord(chapterMatch[1]);
      continue;
    }

    // Match Article: "Articolul 123" or "Articolul 1^234"
    const articleMatch = line.match(/^Articolul\s+(\d+(?:\^\d+)?)/i);
    if (articleMatch) {
      // Save previous article if exists
      if (currentArticle) {
        articles.push(currentArticle);
      }

      // Start new article
      const articleNum = articleMatch[1].replace('^', ''); // Remove superscript marker
      currentArticle = {
        article_number: articleNum,
        article_title: '',
        article_text: '',
        book_number: bookNumber,
        title_number: titleNumber,
        chapter_number: chapterNumber,
        book_name: currentBook,
        title_name: currentTitle,
        chapter_name: currentChapter,
        full_text: line + '\n'
      };
      continue;
    }

    // If we're in an article
    if (currentArticle) {
      // Check if this is the article title (first non-empty line after article number)
      if (!currentArticle.article_title && !line.match(/^\(?\d+\)?/) && !line.startsWith('Notă')) {
        currentArticle.article_title = line;
        currentArticle.full_text += line + '\n';
      } else {
        // Add to article text
        currentArticle.article_text += line + '\n';
        currentArticle.full_text += line + '\n';
      }
    }
  }

  // Don't forget the last article
  if (currentArticle) {
    articles.push(currentArticle);
  }

  console.log(`✅ Parsed ${articles.length} articles from civil code`);
  return articles;
}

/**
 * Convert Roman numerals or Romanian words to numbers
 */
function parseRomanOrWord(str) {
  const romanMap = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
    'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
  };

  const wordMap = {
    'ÎNTÂI': 1, 'PRELIMINAR': 0,
    'A DOUA': 2, 'A TREIA': 3, 'A PATRA': 4,
    'A CINCEA': 5, 'A ȘASEA': 6, 'A ȘAPTEA': 7
  };

  return romanMap[str] || wordMap[str] || null;
}

/**
 * Generate searchable keywords from article content
 */
function generateKeywords(article) {
  const text = `${article.article_title} ${article.article_text}`.toLowerCase();

  // Common legal terms to extract
  const legalTerms = [
    'capacitate', 'persoană', 'fizică', 'juridică', 'drept', 'obligație',
    'contract', 'proprietate', 'vânzare', 'cumpărare', 'donație', 'ipotecă',
    'moștenire', 'testament', 'succesor', 'creditor', 'debitor',
    'răspundere', 'daune', 'prejudiciu', 'culpă', 'intenție',
    'prescripție', 'termen', 'nulitate', 'anulare', 'reziliere',
    'căsătorie', 'divorț', 'filiație', 'adopție', 'tutore', 'curator',
    'bunuri', 'mobiliare', 'imobiliare', 'uzucapiune', 'posesie'
  ];

  const foundKeywords = legalTerms.filter(term => text.includes(term));

  // Add article title words (filter out common words)
  const titleWords = article.article_title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4 && !['privind', 'despre', 'asupra', 'pentru'].includes(word));

  return [...new Set([...foundKeywords, ...titleWords])];
}

/**
 * Upload articles to Supabase in batches
 */
async function uploadToSupabase(articles) {
  console.log('\n📤 Uploading articles to Supabase...');

  const BATCH_SIZE = 100;
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);

    // Transform articles for database
    const dbRecords = batch.map(article => ({
      code_type: 'civil_code',
      legal_branch: 'CIV',
      book_number: article.book_number,
      title_number: article.title_number,
      chapter_number: article.chapter_number,
      article_number: article.article_number,
      article_title: article.article_title || null,
      article_text: article.full_text.trim(),
      article_description: `${article.book_name || ''} ${article.title_name || ''} ${article.chapter_name || ''}`.trim() || null,
      keywords: generateKeywords(article),
      is_current: true,
      effective_date: '2011-10-01' // Date when current Civil Code came into effect
    }));

    // Insert records one by one to handle duplicates gracefully
    let batchSuccess = 0;
    let batchErrors = 0;

    for (const record of dbRecords) {
      const { data, error } = await supabase
        .from('code_articles')
        .insert([record]);

      if (error) {
        // Silently skip duplicate key errors, but log other errors
        if (error.message.includes('duplicate key')) {
          // This is expected, skip silently
          batchErrors++;
        } else {
          // Real error - log it
          console.error(`   ❌ Article ${record.article_number}: ${error.message.substring(0, 100)}`);
          batchErrors++;
        }
      } else {
        batchSuccess++;
      }
    }

    uploaded += batchSuccess;
    errors += batchErrors;

    console.log(`✅ Uploaded batch ${i / BATCH_SIZE + 1}/${Math.ceil(articles.length / BATCH_SIZE)} (${batchSuccess} new, ${batchErrors} skipped) - Total: ${uploaded}/${articles.length}`);
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${uploaded} articles`);
  console.log(`   ❌ Errors: ${errors} articles`);
  console.log(`   📝 Total processed: ${articles.length} articles`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Civil Code Parser & Uploader\n');
  console.log('=' .repeat(50));

  try {
    // Parse the civil code
    const articles = parseCivilCode(CIVIL_CODE_PATH);

    // Show sample
    console.log('\n📋 Sample Article:');
    console.log(JSON.stringify(articles[0], null, 2));

    // Confirm upload
    console.log('\n⚠️  Ready to upload to Supabase.');
    console.log(`   Database: ${SUPABASE_URL}`);
    console.log(`   Table: code_articles`);
    console.log(`   Records: ${articles.length}`);

    // Upload to Supabase
    await uploadToSupabase(articles);

    console.log('\n✅ Civil Code upload completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseCivilCode, uploadToSupabase, generateKeywords };
