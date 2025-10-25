# Vercel Deployment Guide

## Production Deployment

**Live App:** [www.spezi.space](https://www.spezi.space)

The app is successfully deployed on Vercel with automatic deployments from the `master` branch.

---

## Troubleshooting: 404 NOT_FOUND Error

If you encounter a 404 error, it's because your React app is in the `client/` subdirectory, but Vercel is trying to deploy from the root directory.

## Solution: Configure Vercel Project Settings

### Step 1: Access Your Vercel Project Settings

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Find your project: **spezi01**
3. Click on the project name
4. Click **Settings** (gear icon in the top navigation)

### Step 2: Configure Build & Development Settings

Navigate to **Settings** → **General** and configure:

#### Root Directory
- **Set to:** `client`
- Click the **Edit** button next to "Root Directory"
- Type: `client`
- Click **Save**

This tells Vercel your app is in the `client/` folder, not the root.

#### Build Command
- Should automatically detect: `npm run build`
- If not, manually set to: `npm run build`

#### Output Directory
- Should automatically detect: `dist`
- If not, manually set to: `dist`

#### Install Command
- Should automatically detect: `npm install`

### Step 3: Configure Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | `https://pgprhlzpzegwfwcbsrww.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHJobHpwemVnd2Z3Y2Jzcnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTk5MzksImV4cCI6MjA3NjkzNTkzOX0.xPXlziMGCvwIlb0KPqRXfkR1Um-lfW8pM90QXeNNr4w` |

**How to add:**
- Click **Add New** button
- Enter variable name
- Paste value
- Select environments: **Production**, **Preview**, **Development** (check all three)
- Click **Save**

### Step 4: Redeploy

After configuring the settings:

#### Option A: Redeploy from Vercel Dashboard
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Confirm by clicking **Redeploy** again

#### Option B: Push to GitHub (Automatic)
```bash
git add .
git commit -m "Update Vercel configuration"
git push
```

Vercel will automatically detect the push and redeploy.

### Step 5: Verify Deployment

1. Wait for the deployment to complete (usually 1-2 minutes)
2. Click on the deployment URL
3. You should see the login page with the purple gradient
4. Test signup and login functionality

## Troubleshooting

### Still Getting 404?

**Check Root Directory Setting:**
- Make sure Root Directory is set to `client` exactly
- Save and redeploy

**Check Build Logs:**
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Look for error messages in the build logs
4. Common issues:
   - Missing environment variables
   - Build command failed
   - Wrong output directory

### Environment Variables Not Working?

**Verify they're set for all environments:**
- Production ✓
- Preview ✓
- Development ✓

**Check variable names:**
- Must start with `VITE_` for Vite apps
- Case-sensitive

### Build Failing?

**Check the build logs for errors:**

Common fixes:
```bash
# Locally test the build
cd client
npm install
npm run build

# If build succeeds locally, the issue is with Vercel config
```

### TypeScript Errors?

If you see TypeScript compilation errors:
```bash
# Run TypeScript check locally
cd client
npx tsc --noEmit

# Fix any type errors before pushing
```

## Configuration Summary

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Framework Preset | Vite |
| Node.js Version | 18.x or higher |

## Vercel Configuration Files

### vercel.json (in root directory)
This file is configured to handle SPA routing:
- Rewrites all routes to `index.html`
- Enables client-side routing with React Router

### package.json (in client directory)
Contains the build scripts Vercel will run:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## Expected Result

After proper configuration, your deployed site should:

✅ Show the login page at root URL
✅ Handle `/login`, `/signup`, `/dashboard` routes correctly
✅ Connect to Supabase for authentication
✅ Display purple/blue gradient theme
✅ Work on mobile and desktop

## Performance Optimization (Optional)

Once deployment works, consider:

1. **Enable Edge Functions**
   - Settings → Functions → Enable Edge Runtime

2. **Configure Caching**
   - Vercel automatically caches static assets

3. **Add Custom Domain**
   - Settings → Domains → Add domain

## Security Checklist

Before going live:

- [ ] Environment variables are set correctly
- [ ] `.env` file is in `.gitignore` (not committed)
- [ ] Supabase Row Level Security (RLS) is enabled
- [ ] Email confirmations are enabled in Supabase
- [ ] CORS is configured in Supabase settings

## Quick Links

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Docs - Vite | https://vercel.com/docs/frameworks/vite |
| Vercel Docs - Environment Variables | https://vercel.com/docs/projects/environment-variables |
| Supabase Dashboard | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww |

## Need Help?

1. Check Vercel deployment logs
2. Check browser console for errors (F12)
3. Verify Supabase connection in Network tab
4. Review this guide step by step

---

**Most Common Fix:** Set Root Directory to `client` in Vercel Project Settings → General
