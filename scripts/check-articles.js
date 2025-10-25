const fs = require('fs');
const path = require('path');
const { parseCivilCode } = require('./parse-civil-code');

const articles = parseCivilCode(path.join(__dirname, '../Laws/codcivil.txt'));

console.log('📊 Article Statistics:\n');
console.log(`Total articles parsed: ${articles.length}`);

// Count unique article numbers
const articleNumbers = articles.map(a => a.article_number);
const uniqueNumbers = new Set(articleNumbers);
console.log(`Unique article numbers: ${uniqueNumbers.size}`);
console.log(`Duplicates: ${articles.length - uniqueNumbers.size}\n`);

// Find duplicate numbers
const numberCounts = {};
articleNumbers.forEach(num => {
  numberCounts[num] = (numberCounts[num] || 0) + 1;
});

const duplicates = Object.entries(numberCounts)
  .filter(([num, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

if (duplicates.length > 0) {
  console.log(`\nTop 10 Most Duplicated Article Numbers:`);
  duplicates.slice(0, 10).forEach(([num, count]) => {
    console.log(`  Article ${num}: appears ${count} times`);
  });
}

// Sample some articles
console.log(`\n📋 Sample Articles:`);
console.log(JSON.stringify(articles[0], null, 2));
console.log(JSON.stringify(articles[500], null, 2));
console.log(JSON.stringify(articles[1000], null, 2));
