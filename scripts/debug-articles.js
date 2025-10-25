/**
 * Debug - Check what article numbers are being parsed
 */

const fs = require('fs');
const path = require('path');

function parseCivilCode() {
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
      // Save previous article
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

    // Detect annotations
    if (line.startsWith('Notă') || line.startsWith('Nota')) {
      pendingAnnotation = line + '\n';
      continue;
    }

    // If collecting annotation
    if (pendingAnnotation && !currentArticle) {
      pendingAnnotation += line + '\n';
      continue;
    }

    // If in article
    if (currentArticle) {
      if (!currentArticle.article_title && !line.match(/^\(?(\d+|\w)\)?/) && line.length > 3) {
        currentArticle.article_title = line;
      } else {
        currentArticle.article_text += line + '\n';
      }
    }
  }

  // Last article
  if (currentArticle) {
    if (pendingAnnotation) {
      currentArticle.annotations = pendingAnnotation.trim();
    }
    articles.push(currentArticle);
  }

  return articles;
}

const articles = parseCivilCode();
console.log(`Total articles: ${articles.length}\n`);

// Get all article numbers
const articleNumbers = articles.map(a => a.article_number);

// Find duplicates
const numberCounts = {};
articleNumbers.forEach(num => {
  numberCounts[num] = (numberCounts[num] || 0) + 1;
});

const duplicates = Object.entries(numberCounts)
  .filter(([num, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

console.log(`Duplicate article numbers: ${duplicates.length}\n`);
duplicates.forEach(([num, count]) => {
  console.log(`  Article ${num}: appears ${count} times`);
});

// Check articles around position 999-1005
console.log(`\nArticles around position 999-1005:`);
for (let i = 998; i < Math.min(1005, articles.length); i++) {
  console.log(`  [${i}] Article ${articles[i].article_number}: "${articles[i].article_title.substring(0, 50)}"`);
}

// Find where the duplication pattern starts
console.log(`\nChecking for duplicate patterns...`);
const seen = new Set();
let firstDupeIndex = -1;

for (let i = 0; i < articles.length; i++) {
  const num = articles[i].article_number;
  if (seen.has(num)) {
    if (firstDupeIndex === -1) {
      firstDupeIndex = i;
      console.log(`First duplicate found at index ${i}: Article ${num}`);
      console.log(`  Previous occurrence was at index ${articles.findIndex(a => a.article_number === num)}`);
      break;
    }
  }
  seen.add(num);
}

// Show statistics
console.log(`\nStatistics:`);
console.log(`  Unique article numbers: ${new Set(articleNumbers).size}`);
console.log(`  Total parsed: ${articles.length}`);
console.log(`  Difference: ${articles.length - new Set(articleNumbers).size}`);
