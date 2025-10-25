/**
 * Test Romanian Civil Code search functionality
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgprhlzpzegwfwcbsrww.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testSearch() {
  console.log('🔍 Testing Civil Code Search\n');
  console.log('='.repeat(50) + '\n');

  // Test 1: Count total articles
  console.log('Test 1: Count total articles');
  const { count, error: countError } = await supabase
    .from('code_articles')
    .select('*', { count: 'exact', head: true })
    .eq('code_type', 'civil_code');

  if (countError) {
    console.error('❌ Error:', countError.message);
  } else {
    console.log(`✅ Total articles: ${count}\n`);
  }

  // Test 2: Search by article number
  console.log('Test 2: Search by article number (Article 1)');
  const { data: article1, error: searchError1 } = await supabase
    .from('code_articles')
    .select('article_number, article_title, article_text')
    .eq('code_type', 'civil_code')
    .eq('article_number', '1')
    .single();

  if (searchError1) {
    console.error('❌ Error:', searchError1.message);
  } else {
    console.log(`✅ Article ${article1.article_number}`);
    console.log(`   Title: ${article1.article_title || 'N/A'}`);
    console.log(`   Text length: ${article1.article_text.length} chars\n`);
  }

  // Test 3: Full-text search for "capacitate"
  console.log('Test 3: Full-text search for "capacitate" (capacity)');
  const { data: capacitateResults, error: searchError2 } = await supabase
    .from('code_articles')
    .select('article_number, article_title')
    .eq('code_type', 'civil_code')
    .textSearch('article_text', 'capacitate', {
      type: 'websearch',
      config: 'romanian'
    })
    .limit(5);

  if (searchError2) {
    console.error('❌ Error:', searchError2.message);
  } else {
    console.log(`✅ Found ${capacitateResults.length} results (showing first 5):`);
    capacitateResults.forEach(r => {
      console.log(`   - Article ${r.article_number}: ${r.article_title || 'N/A'}`);
    });
    console.log();
  }

  // Test 4: Full-text search for "contract" or "contractual"
  console.log('Test 4: Full-text search for "contract"');
  const { data: contractResults, error: searchError3 } = await supabase
    .from('code_articles')
    .select('article_number, article_title')
    .eq('code_type', 'civil_code')
    .textSearch('article_text', 'contract', {
      type: 'websearch',
      config: 'romanian'
    })
    .limit(5);

  if (searchError3) {
    console.error('❌ Error:', searchError3.message);
  } else {
    console.log(`✅ Found ${contractResults.length} results (showing first 5):`);
    contractResults.forEach(r => {
      console.log(`   - Article ${r.article_number}: ${r.article_title || 'N/A'}`);
    });
    console.log();
  }

  // Test 5: Search within a range of articles
  console.log('Test 5: Search articles 100-110');
  const { data: rangeResults, error: searchError4 } = await supabase
    .from('code_articles')
    .select('article_number, article_title')
    .eq('code_type', 'civil_code')
    .gte('article_number', '100')
    .lte('article_number', '110')
    .order('article_number');

  if (searchError4) {
    console.error('❌ Error:', searchError4.message);
  } else {
    console.log(`✅ Found ${rangeResults.length} articles:`);
    rangeResults.forEach(r => {
      console.log(`   - Article ${r.article_number}: ${r.article_title || 'N/A'}`);
    });
    console.log();
  }

  // Test 6: Get articles with hierarchy info
  console.log('Test 6: Sample articles with hierarchy (first 3)');
  const { data: hierarchyResults, error: searchError5 } = await supabase
    .from('code_articles')
    .select('article_number, article_title, book, title, chapter')
    .eq('code_type', 'civil_code')
    .limit(3);

  if (searchError5) {
    console.error('❌ Error:', searchError5.message);
  } else {
    hierarchyResults.forEach(r => {
      console.log(`\n   Article ${r.article_number}: ${r.article_title || 'N/A'}`);
      console.log(`   Book: ${r.book || 'N/A'}`);
      console.log(`   Title: ${r.title || 'N/A'}`);
      console.log(`   Chapter: ${r.chapter || 'N/A'}`);
    });
    console.log();
  }

  console.log('\n✅ All search tests completed!');
}

testSearch().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
