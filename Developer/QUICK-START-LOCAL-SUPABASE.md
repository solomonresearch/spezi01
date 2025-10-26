# 🚀 Quick Start: Local Supabase Development

## Step-by-Step Setup (Do This Now)

### 1. Update Supabase CLI (Recommended)

```bash
npm update -g supabase
# Or with Homebrew: brew upgrade supabase
```

### 2. Link to Production

```bash
cd /Users/v/solomonresearch/spezi01
supabase link --project-ref pgprhlzpzegwfwcbsrww
```

When prompted, enter your database password: `3S_LRQm!gnJf3V$`

### 3. Pull Current Schema from Production

```bash
supabase db pull
```

This downloads your production schema as a migration file.

### 4. Start Local Supabase

**Make sure Docker Desktop is running first!**

```bash
supabase start
```

This will output:
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGc...
service_role key: eyJhbGc...
```

**Copy the anon key** - you'll need it for `.env.local`

### 5. Create .env.local for Local Development

Create `client/.env.local`:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<paste-anon-key-from-step-4>
```

### 6. Test Your Migration Locally

```bash
# Apply your new migration to local database
supabase db reset
```

This runs ALL migrations including your new one.

### 7. Open Studio to Verify

```bash
open http://localhost:54323
```

Check that:
- `cases` table has `verified` and `case_code` columns
- Case codes were generated
- View works correctly

### 8. Run Your React App Locally

```bash
cd client
npm run dev
```

It will now connect to your LOCAL Supabase!

### 9. Test Everything Works

- Login/signup
- View cases
- Check case codes display
- Verify badges appear (none yet since verified=false)

### 10. Push to Production When Ready

```bash
supabase db push
```

Enter password when prompted: `3S_LRQm!gnJf3V$`

This applies your migration to production!

---

## 📝 For Your Next Migration

### The Full Workflow:

```bash
# 1. Start local
supabase start

# 2. Create migration
supabase migration new my_new_feature

# 3. Edit the file in: supabase/migrations/<timestamp>_my_new_feature.sql

# 4. Apply locally
supabase db reset

# 5. Test in Studio
open http://localhost:54323

# 6. Test in app (points to local via .env.local)
cd client && npm run dev

# 7. Commit migration to Git
git add supabase/migrations/
git commit -m "Add my new feature migration"

# 8. Push to production
supabase db push

# 9. Push code to GitHub
git push origin master

# 10. Deploy frontend to Vercel (auto-deploys from GitHub)
```

---

## 🎯 What You Get

✅ **Local development** - Test safely without touching production
✅ **Version controlled migrations** - All schema changes in Git
✅ **Easy rollback** - Just revert the migration file
✅ **Team collaboration** - Everyone gets same DB with `supabase start`
✅ **CI/CD ready** - Automated testing possible

---

## ⚠️ Important

- **Local DB is on your machine** - Not shared with team until you push
- **Production requires password** - Keep it safe
- **Always test locally first** - Don't push untested migrations
- **.env.local is gitignored** - Each dev creates their own
- **Docker must be running** - Required for `supabase start`

---

## 🔄 Daily Commands

```bash
# Start working
supabase start

# Done for the day
supabase stop

# See running services
supabase status

# Reset local DB to fresh state
supabase db reset

# Push changes to production
supabase db push
```

---

## Next: Apply Your Current Migration

Run these commands now:

```bash
# Make sure Docker is running
supabase start

# Apply migration locally
supabase db reset

# Verify in Studio
open http://localhost:54323

# Push to production when ready
supabase db push
```
