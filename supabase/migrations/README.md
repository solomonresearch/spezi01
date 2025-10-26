# Database Migrations

This folder contains all SQL migrations for the Spezi01 project.

## Migration Files

Migrations are named with timestamp: `YYYYMMDDHHMMSS_description.sql`

### Applied Migrations

- ✅ `20251025_create_law_tutor_schema.sql` - Initial schema
- ✅ `20251025214116_create_cases_tables.sql` - Cases tables
- ⏳ `20251026_add_verified_and_case_code.sql` - **PENDING** - Add verification flag and case codes

## How to Apply a Migration

### Quick Method (Recommended)

```bash
# Show the migration and open SQL Editor
node scripts/show-migration.js supabase/migrations/20251026_add_verified_and_case_code.sql
```

This will:
1. Display the SQL
2. Copy it to your clipboard
3. Open Supabase SQL Editor
4. You paste and click RUN

### Manual Method

1. Open: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new
2. Copy-paste the migration SQL
3. Click **RUN**
4. Verify in Table Editor

## Creating New Migrations

```bash
# Create new file with timestamp
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_your_feature.sql

# Edit the file
code supabase/migrations/[filename].sql
```

### Migration Template

```sql
-- Migration: [Name]
-- Date: YYYY-MM-DD
-- Description: Brief description

-- Your SQL here
ALTER TABLE ...;
CREATE INDEX ...;
```

## Current Status

**Last Updated:** 2025-10-26

**Pending Migrations:**
- `20251026_add_verified_and_case_code.sql`

**Next Steps:**
1. Apply pending migration
2. Update this README
3. Commit changes
