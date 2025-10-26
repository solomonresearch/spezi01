# Supabase Local Development Workflow

This guide explains how to work with Supabase locally and sync changes to production.

## Prerequisites

- Docker Desktop installed and running
- Supabase CLI installed (update to latest version)
- Git initialized in project

## 🚀 Setup Local Supabase (One-Time)

### 1. Update Supabase CLI

```bash
# Update to latest version
npm update -g supabase

# Or with Homebrew (Mac)
brew upgrade supabase
```

### 2. Initialize Supabase (if not already done)

```bash
cd /Users/v/solomonresearch/spezi01
supabase init
```

This creates:
- `supabase/config.toml` - Local Supabase configuration
- `supabase/.gitignore` - Ignores local Docker data
- `supabase/seed.sql` - Seed data for local development

### 3. Link to Remote Project

```bash
supabase link --project-ref pgprhlzpzegwfwcbsrww
```

You'll be prompted for your database password. This connects your local setup to production.

### 4. Pull Current Schema from Production

```bash
supabase db pull
```

This downloads your current production schema as a migration file.

---

## 📝 Daily Development Workflow

### Option A: Create New Migrations (Recommended)

#### 1. Start Local Supabase

```bash
# Start local Supabase (runs in Docker)
supabase start
```

This starts:
- PostgreSQL database (local)
- Studio UI at http://localhost:54323
- API server
- Auth server

#### 2. Create a New Migration

```bash
# Create a new migration file
supabase migration new add_verified_and_case_code
```

This creates: `supabase/migrations/YYYYMMDDHHMMSS_add_verified_and_case_code.sql`

#### 3. Write Your SQL Changes

Edit the migration file:

```sql
-- supabase/migrations/20251026120000_add_verified_and_case_code.sql

ALTER TABLE cases
ADD COLUMN verified BOOLEAN DEFAULT FALSE,
ADD COLUMN case_code TEXT UNIQUE;

CREATE INDEX idx_cases_code ON cases(case_code);
```

#### 4. Apply Migration Locally

```bash
# Reset local database and apply all migrations
supabase db reset
```

This:
- Drops local database
- Recreates from scratch
- Runs all migrations in order
- Runs seed.sql

**OR** just apply new migrations:

```bash
# Apply pending migrations only
supabase migration up
```

#### 5. Test Locally

- Open Studio UI: http://localhost:54323
- Verify schema changes
- Test queries
- Check data

#### 6. Update Local Connection String in Your App

```env
# .env.local (for local development)
VITE_SUPABASE_URL=http://localhost:54323
VITE_SUPABASE_ANON_KEY=eyJhbGc... (from supabase start output)
```

#### 7. Push to Production When Ready

```bash
# Push migrations to remote database
supabase db push
```

You'll be prompted for the database password.

This applies all pending migrations to production.

#### 8. Stop Local Supabase (when done)

```bash
supabase stop
```

---

### Option B: Manual SQL in Studio → Export as Migration

#### 1. Start Local Supabase

```bash
supabase start
```

#### 2. Make Changes in Studio UI

- Go to http://localhost:54323
- Use SQL Editor to create tables, add columns, etc.
- Test everything

#### 3. Generate Migration from Changes

```bash
# Compare local DB to last migration and create new migration
supabase db diff -f add_my_changes
```

This auto-generates a migration file with your changes!

#### 4. Push to Production

```bash
supabase db push
```

---

## 🔄 Common Commands

### Local Development

```bash
# Start local Supabase (Docker required)
supabase start

# Stop local Supabase
supabase stop

# Reset local database (drop + recreate + run all migrations)
supabase db reset

# Open Studio UI
open http://localhost:54323
```

### Migrations

```bash
# Create new migration file
supabase migration new <name>

# Apply all pending migrations locally
supabase migration up

# Generate migration from local changes
supabase db diff -f <migration_name>

# List all migrations
supabase migration list
```

### Sync with Production

```bash
# Pull schema from production → create migration
supabase db pull

# Push local migrations → production
supabase db push

# Dump production data
supabase db dump --data-only > backup.sql
```

### Remote Database

```bash
# Link to remote project
supabase link --project-ref pgprhlzpzegwfwcbsrww

# Check remote database status
supabase db remote status

# Execute SQL on remote (use carefully!)
supabase db execute --file migration.sql --db-url <YOUR_DB_URL>
```

---

## 🎯 Recommended Workflow for This Project

### For New Features:

1. **Start local**: `supabase start`
2. **Create migration**: `supabase migration new feature_name`
3. **Write SQL** in migration file
4. **Apply locally**: `supabase db reset`
5. **Test locally** with your React app pointing to localhost
6. **Commit migration** to Git
7. **Push to production**: `supabase db push`
8. **Update production .env** if needed
9. **Deploy frontend** to Vercel

### For Quick Fixes:

1. **Pull current schema**: `supabase db pull`
2. **Edit migration** or create new one
3. **Push to production**: `supabase db push`

---

## 📁 Project Structure

```
spezi01/
├── supabase/
│   ├── config.toml              # Local Supabase config
│   ├── seed.sql                 # Seed data for local dev
│   ├── .gitignore               # Ignore Docker volumes
│   └── migrations/              # All migration files (version controlled)
│       ├── 20251025_create_cases.sql
│       ├── 20251026_add_verified.sql
│       └── ...
├── client/
│   ├── .env                     # Production Supabase URL
│   └── .env.local               # Local Supabase URL (gitignored)
└── scripts/
    └── seed-data.sql            # Additional seed scripts
```

---

## 🔐 Environment Setup

### Production (.env)

```env
VITE_SUPABASE_URL=https://pgprhlzpzegwfwcbsrww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Local (.env.local) - Create this file

```env
VITE_SUPABASE_URL=http://localhost:54323
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

Get the anon key from `supabase start` output.

---

## 🐛 Troubleshooting

### "Docker not running"

```bash
# Make sure Docker Desktop is running
open -a Docker
# Wait for Docker to start, then:
supabase start
```

### "Migration already exists on remote"

```bash
# Reset migration history (careful!)
supabase db remote commit

# Or pull and merge
supabase db pull
```

### "Password authentication failed"

```bash
# Use the database password from Supabase Dashboard
# Settings → Database → Database password
# Reset password if forgotten
```

### "Port already in use"

```bash
# Stop existing Supabase instance
supabase stop

# Or change ports in config.toml
```

---

## ✅ Benefits of Local Development

1. **Fast iteration** - No network latency
2. **Safe testing** - Don't affect production
3. **Version control** - All schema changes in Git
4. **Reproducible** - Anyone can `supabase start` and get exact DB
5. **Rollback easy** - Just revert migration file
6. **CI/CD ready** - Migrations run in automated tests

---

## 🚨 Important Notes

- **ALWAYS** test migrations locally before pushing
- **NEVER** edit production DB directly via SQL Editor
- **ALWAYS** create migrations for schema changes
- **COMMIT** migration files to Git
- **BACKUP** production before major migrations
- Local DB is ephemeral - `supabase stop` keeps data, `docker system prune` removes it

---

## Next Steps

1. Run `supabase init` (if not already done)
2. Run `supabase link --project-ref pgprhlzpzegwfwcbsrww`
3. Run `supabase db pull` to sync current schema
4. Run `supabase start` to start local development
5. Create `.env.local` with local Supabase URL
6. Start developing!
