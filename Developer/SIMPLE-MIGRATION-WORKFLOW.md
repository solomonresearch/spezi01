# 🎯 Simple Migration Workflow (No Docker)

## Direct to Production Approach

This workflow applies migrations directly to your remote Supabase database without local Docker setup.

---

## 📁 Folder Structure

```
spezi01/
├── supabase/
│   └── migrations/              # All SQL migration files
│       ├── 20251025_create_cases.sql
│       ├── 20251026_add_verified_and_case_code.sql
│       └── ...future migrations...
└── scripts/
    └── apply-migration.js       # Script to apply migrations
```

---

## 🚀 Workflow: Create and Apply Migration

### Step 1: Create Migration File

```bash
cd /Users/v/solomonresearch/spezi01

# Create new migration file with timestamp
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_your_feature_name.sql
```

Or just create it manually:
```
supabase/migrations/20251026140000_my_new_feature.sql
```

### Step 2: Write Your SQL

Edit the migration file:

```sql
-- supabase/migrations/20251026140000_my_new_feature.sql

-- Example: Add a new column
ALTER TABLE cases ADD COLUMN some_field TEXT;

-- Example: Create an index
CREATE INDEX idx_cases_some_field ON cases(some_field);
```

### Step 3: Apply to Production

**Option A: Via Supabase Dashboard (Easiest)**

1. Open: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new
2. Copy-paste your migration SQL
3. Click **RUN**
4. Verify in Table Editor

**Option B: Via Script**

```bash
# Apply specific migration
node scripts/apply-migration.js supabase/migrations/20251026_add_verified_and_case_code.sql
```

### Step 4: Commit to Git

```bash
git add supabase/migrations/
git commit -m "Add [feature name] migration"
git push origin master
```

---

## 🛠️ Helper Script

I'll create a script that applies any migration file to your remote database.

**Usage:**

```bash
# Apply a specific migration
node scripts/apply-migration.js supabase/migrations/20251026_my_feature.sql

# Apply latest migration
node scripts/apply-migration.js supabase/migrations/$(ls -t supabase/migrations/*.sql | head -1)
```

---

## 📝 Best Practices

### Migration File Naming

Use this format:
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Examples:
- `20251026140530_add_verified_flag.sql`
- `20251026141200_create_comments_table.sql`
- `20251026142000_add_user_roles.sql`

### Migration Content

Always include:

```sql
-- Migration: [Name]
-- Date: YYYY-MM-DD
-- Description: What this migration does

-- Add your changes here
ALTER TABLE ...;
CREATE INDEX ...;
```

### Testing

Before applying:
1. Review SQL carefully
2. Test in a copy of production data if possible
3. Have a rollback plan

---

## 🔄 Common Operations

### Add a Column

```sql
-- supabase/migrations/20251026_add_status.sql
ALTER TABLE cases ADD COLUMN status TEXT DEFAULT 'active';
```

### Create a Table

```sql
-- supabase/migrations/20251026_create_comments.sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_case_id ON comments(case_id);
```

### Update Data

```sql
-- supabase/migrations/20251026_mark_cases_verified.sql
UPDATE cases
SET verified = TRUE
WHERE id IN ('uuid1', 'uuid2', 'uuid3');
```

### Create View

```sql
-- supabase/migrations/20251026_create_stats_view.sql
CREATE OR REPLACE VIEW case_stats AS
SELECT
    subcategory,
    COUNT(*) as total_cases,
    SUM(CASE WHEN verified THEN 1 ELSE 0 END) as verified_cases
FROM cases
GROUP BY subcategory;

GRANT SELECT ON case_stats TO authenticated;
```

---

## 🔙 Rollback Strategy

If something goes wrong:

### Option 1: Undo Migration (Manual)

Create a new migration that reverses the changes:

```sql
-- supabase/migrations/20251026_rollback_feature.sql
-- Rollback for: 20251026_add_feature.sql

ALTER TABLE cases DROP COLUMN some_field;
```

### Option 2: Restore from Backup

1. Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/database/backups
2. Find latest backup before the migration
3. Restore if needed

---

## ✅ Current Migration Status

Track applied migrations in a simple text file:

```bash
echo "20251026_add_verified_and_case_code.sql - Applied 2025-10-26" >> supabase/MIGRATIONS_APPLIED.txt
```

---

## 🎯 Quick Reference

```bash
# Create migration
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_feature.sql

# Edit migration
code supabase/migrations/[filename].sql

# Apply via dashboard
# Copy-paste to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new

# OR apply via script
node scripts/apply-migration.js supabase/migrations/[filename].sql

# Commit
git add supabase/migrations/
git commit -m "Add migration: [name]"
git push
```

---

## 📊 Your Current Pending Migration

You have this migration ready to apply:

**File:** `supabase/migrations/20251026_add_verified_and_case_code.sql`

**To apply it now:**

1. Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new
2. Copy the contents of the file
3. Click RUN
4. Check Table Editor to verify `verified` and `case_code` columns exist

**OR use the script:**

```bash
node scripts/apply-migration.js supabase/migrations/20251026_add_verified_and_case_code.sql
```
