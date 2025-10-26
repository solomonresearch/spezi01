const fs = require('fs');
const path = require('path');

// Read parsed cases
const casesPath = path.join(__dirname, '..', 'cases', 'parsed_cases.json');
const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));

console.log(`Processing ${cases.length} verified cases...\n`);

// Generate SQL to mark these cases as verified
const caseIds = cases.map(c => `'${c.id}'`).join(',\n    ');

const sql = `-- Migration: Mark verified cases from Excel
-- Date: 2025-10-26
-- Description: Update ${cases.length} cases to mark them as verified by legal professional

-- Mark cases as verified
UPDATE cases
SET verified = TRUE
WHERE id IN (
    ${caseIds}
);

-- Verify the update
SELECT
    COUNT(*) as total_verified,
    COUNT(CASE WHEN verified THEN 1 END) as verified_count
FROM cases
WHERE id IN (
    ${caseIds}
);
`;

// Save SQL file
const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251026152000_mark_cases_verified.sql');
fs.writeFileSync(outputPath, sql);

console.log('✓ SQL migration created:', outputPath);
console.log(`\nCase IDs to be marked as verified:`);
cases.forEach((c, i) => {
    console.log(`  ${i+1}. ${c.case_code}: ${c.title}`);
});
console.log(`\nTotal: ${cases.length} cases\n`);
