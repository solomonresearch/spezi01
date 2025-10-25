/**
 * Parse Romanian Civil Code to CSV
 * Simple structure: article_number, title, text, hierarchy, annotations
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../Laws/codcivil.txt');
const outputPath = path.join(__dirname, '../Laws/codul_civil.csv');

function parseCivilCodeToCSV() {
  console.log('📖 Reading civil code...\n');

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

    // Detect article start
    const articleMatch = line.match(/^Articolul\s+(\d+(?:\^\d+)?)/i);
    if (articleMatch) {
      // Save previous article with its annotation
      if (currentArticle) {
        if (pendingAnnotation) {
          currentArticle.annotations = pendingAnnotation;
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
      if (!currentArticle.article_title && !line.match(/^\(?\d+\)?/) && line.length > 3) {
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
      currentArticle.annotations = pendingAnnotation;
    }
    articles.push(currentArticle);
  }

  console.log(`✅ Parsed ${articles.length} articles\n`);
  return articles;
}

function escapeCSV(str) {
  if (!str) return '';
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str}"`;
  }
  return str;
}

function writeCSV(articles) {
  console.log('📝 Writing CSV file...\n');

  // CSV Header
  const header = 'article_number,article_title,article_text,book,title,chapter,section,annotations\n';

  // CSV Rows
  const rows = articles.map(article => {
    return [
      escapeCSV(article.article_number),
      escapeCSV(article.article_title),
      escapeCSV(article.article_text.trim()),
      escapeCSV(article.book),
      escapeCSV(article.title),
      escapeCSV(article.chapter),
      escapeCSV(article.section),
      escapeCSV(article.annotations.trim())
    ].join(',');
  }).join('\n');

  const csv = header + rows;

  fs.writeFileSync(outputPath, csv, 'utf-8');

  console.log(`✅ CSV file created: ${outputPath}`);
  console.log(`📊 Total articles: ${articles.length}`);
  console.log(`📁 File size: ${(csv.length / 1024 / 1024).toFixed(2)} MB\n`);
}

function showSample(articles) {
  console.log('📋 Sample Articles:\n');

  // Show first article
  console.log('Article 1:');
  console.log(JSON.stringify(articles[0], null, 2));

  // Show article with annotation
  const withAnnotation = articles.find(a => a.annotations.length > 0);
  if (withAnnotation) {
    console.log('\nArticle with annotation:');
    console.log(JSON.stringify(withAnnotation, null, 2));
  }

  console.log('\n');
}

// Main execution
console.log('🚀 Civil Code CSV Parser\n');
console.log('='.repeat(50) + '\n');

try {
  const articles = parseCivilCodeToCSV();
  showSample(articles);
  writeCSV(articles);

  console.log('✅ Success! CSV file ready for upload.');
  console.log('\nNext step: Upload to Supabase using the CSV import feature.\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
