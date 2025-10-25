# Supabase Data Storage Guide

## Where User Authentication Data is Stored

### 1. Supabase Dashboard (Web Interface)

**Direct Link to Your Project:**
https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww

**To View Registered Users:**
1. Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/users
2. Click **Authentication** → **Users** in the left sidebar
3. You'll see a table with all registered users showing:
   - Email address
   - User ID (UUID)
   - Created at timestamp
   - Last sign in
   - Confirmation status

### 2. Database Schema

User data is stored in the `auth` schema (managed by Supabase):

#### Main Tables:

**`auth.users`** - Primary user information
- `id` (UUID) - Unique user identifier
- `email` - User email address
- `encrypted_password` - Hashed password (bcrypt)
- `email_confirmed_at` - Email confirmation timestamp
- `created_at` - Account creation date
- `updated_at` - Last update timestamp
- `raw_user_meta_data` - Custom user metadata (JSON)
- `raw_app_meta_data` - App metadata (JSON)

**`auth.identities`** - Authentication providers
- Links users to their authentication method (email, Google, etc.)

**`auth.sessions`** - Active user sessions
- Session tokens
- Expiry times
- Device information

**`auth.refresh_tokens`** - JWT refresh tokens
- For maintaining logged-in state

### 3. Connection Details

**Project Reference ID:** `pgprhlzpzegwfwcbsrww`

**Database Connection String:**
```
postgresql://postgres.pgprhlzpzegwfwcbsrww:[YOUR_PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres
```

**Region:** eu-north-1 (Stockholm, Sweden)

### 4. Accessing Data Programmatically

#### Via Supabase Client (Recommended):

```javascript
// In your React app
import { supabase } from './lib/supabase';

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// List all users (requires service role key - admin only)
const { data: users } = await supabase.auth.admin.listUsers();
```

#### Via SQL (Using Supabase SQL Editor):

Go to: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new

```sql
-- View all users (using auth.users table)
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM auth.users;

-- View users created today
SELECT email, created_at
FROM auth.users
WHERE created_at::date = CURRENT_DATE;
```

### 5. Creating Custom User Data Tables

While Supabase handles authentication, you'll want to create your own tables for additional user data:

```sql
-- Example: Create a profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);
```

### 6. Environment Variables

Your current setup uses these Supabase credentials:

```env
VITE_SUPABASE_URL=https://pgprhlzpzegwfwcbsrww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Security Note:**
- `ANON_KEY` - Safe for client-side use (public)
- `SERVICE_ROLE_KEY` - Keep secret, never expose in client code (admin access)

### 7. Monitoring & Analytics

**View Auth Activity:**
https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/users

**View Logs:**
https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/logs/explorer

**API Logs:**
- Track login attempts
- Monitor sign-up events
- Debug authentication errors

### 8. Data Export

To export user data:

1. **Via Dashboard:**
   - Go to Table Editor
   - Select `auth.users`
   - Click "Download as CSV"

2. **Via CLI:**
   ```bash
   supabase db dump --db-url "postgresql://postgres.pgprhlzpzegwfwcbsrww:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres" --data-only --schema auth > auth_backup.sql
   ```

### 9. Best Practices

✅ **Do:**
- Store only essential data in `auth.users`
- Create separate `public.profiles` table for user profiles
- Use Row Level Security (RLS) policies
- Regularly backup your database
- Monitor authentication logs

❌ **Don't:**
- Store sensitive data in `raw_user_meta_data`
- Expose `SERVICE_ROLE_KEY` in client code
- Query `auth.users` directly from client (use Supabase Auth API)
- Disable email confirmations in production

### 10. Quick Access Links

| Resource | URL |
|----------|-----|
| Project Dashboard | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww |
| Auth Users | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/users |
| Table Editor | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/editor |
| SQL Editor | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql/new |
| API Docs | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/api |
| Logs | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/logs |

---

**Summary:** User authentication data is automatically stored in Supabase's `auth` schema. Access it via the dashboard at the Auth Users page, or query programmatically using the Supabase client.
