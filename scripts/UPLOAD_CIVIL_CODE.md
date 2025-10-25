# Civil Code Upload Guide

This guide walks you through uploading the Romanian Civil Code (2,680 articles) to Supabase.

## Step 1: Create Database Tables

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql
   - Click "New query"

2. **Copy and paste the SQL from `scripts/create-tables.sql`:**
   ```sql
   -- The SQL creates:
   -- - code_types table (for Civil Code, Constitution, Criminal Code)
   -- - code_articles table (for all articles)
   -- - Indexes for fast searching (by number, keywords, full-text)
   ```

3. **Run the query** (Click "Run" or press Ctrl+Enter)

4. **Verify success:**
   - You should see: "Tables created successfully!"
   - Check the Tables view: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/editor

## Step 2: Upload Civil Code Articles

Run the upload script:

```bash
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJobHpwemVnd2Z3Y2Jzcnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM1OTkzOSwiZXhwIjoyMDc2OTM1OTM5fQ.vKvDO3np3ki7pi9d_-p9xRenR2tv-9p6hOvteFANyqI node scripts/parse-civil-code.js
```

The script will:
- ✅ Parse 2,680 articles from `/Laws/codcivil.txt`
- ✅ Extract article numbers, titles, and full text
- ✅ Generate searchable keywords automatically
- ✅ Upload in batches of 100 articles
- ✅ Track progress in real-time

## Step 3: Verify Upload

Check the data in Supabase:

1. **Table Editor:**
   - https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/editor/29403
   - You should see 2,680 rows in `code_articles`

2. **Test a search query:**
   ```sql
   -- Search by article number
   SELECT * FROM code_articles
   WHERE article_number = '38';

   -- Search by keyword
   SELECT * FROM code_articles
   WHERE keywords @> '["capacitate"]';

   -- Full-text search
   SELECT article_number, article_title
   FROM code_articles
   WHERE to_tsvector('romanian', article_text) @@ to_tsquery('romanian', 'capacitate & exercițiu')
   LIMIT 10;
   ```

## What Gets Stored

For each article:
- **article_number**: "1", "38", "2664", etc.
- **article_title**: "Izvoarele dreptului civil", "Capacitatea de exercițiu", etc.
- **article_text**: Full article text with all paragraphs
- **book_number**, **title_number**, **chapter_number**: Structural hierarchy
- **keywords**: Auto-generated array for search (JSON)
- **code_type**: "civil_code"
- **legal_branch**: "CIV"
- **effective_date**: "2011-10-01" (when current code took effect)

## Search Optimization

The system creates 4 indexes for maximum search speed:

1. **Article Number Index**: Lightning-fast lookup by article number
2. **Code Type Index**: Filter by legal code (Civil, Criminal, Constitution)
3. **Keywords GIN Index**: Fast JSON array searching
4. **Full-Text Index**: Romanian language full-text search with stemming

## Example Article

```json
{
  "article_number": "38",
  "article_title": "Capacitatea deplină de exercițiu",
  "article_text": "(1) Capacitatea deplină de exercițiu se dobândește la împlinirea vârstei de 18 ani...",
  "book_number": 1,
  "title_number": 2,
  "chapter_number": 1,
  "code_type": "civil_code",
  "keywords": ["capacitate", "exercițiu", "persoană", "fizică", "drept"],
  "effective_date": "2011-10-01"
}
```

## Troubleshooting

### Tables already exist error
- This is OK! The script uses IF NOT EXISTS
- Articles won't be duplicated (UNIQUE constraint on code_type + article_number)

### Upload fails
- Check service key is correct
- Ensure tables exist (run Step 1 first)
- Check Supabase dashboard for errors

### Slow search performance
- Verify indexes exist:
  ```sql
  SELECT indexname FROM pg_indexes
  WHERE tablename = 'code_articles';
  ```

## Next Steps

After upload, you can:

1. **Test search in your app** at https://www.spezi.space
2. **Add more legal codes** (Constitution, Criminal Code)
3. **Create search API endpoints** in Supabase Edge Functions
4. **Build autocomplete** using keywords array

---

**Total Articles**: 2,680
**Database**: Supabase PostgreSQL with Romanian language support
**Indexes**: 4 optimized indexes for sub-second search
**Storage**: ~2MB compressed text data
