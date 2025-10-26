const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, '..', 'cases', 'cazuri_drept_civil_extinse.xlsx');
console.log('Reading Excel file:', filePath);

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
console.log('Sheet name:', sheetName);

const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('\nTotal rows:', data.length);
console.log('\nFirst row sample:');
console.log(JSON.stringify(data[0], null, 2));

console.log('\nColumn names:');
if (data.length > 0) {
  console.log(Object.keys(data[0]).join(', '));
}

// Save to JSON for inspection
const outputPath = path.join(__dirname, '..', 'cases', 'parsed_cases.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`\nData saved to: ${outputPath}`);
