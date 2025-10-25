# Supabase URL Configuration Guide

## Configure Email Confirmation Redirect for www.spezi.space

This guide shows you how to configure Supabase authentication URLs so that email confirmation links redirect users to your production domain **www.spezi.space** instead of localhost.

## Why This is Important

When users sign up, Supabase sends them a confirmation email with a link. By default, this link redirects to `http://localhost:3000`. For production, you need it to redirect to `https://www.spezi.space`.

## Step-by-Step Configuration

### 1. Access Supabase URL Configuration

**Direct Link:**
https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/url-configuration

**Or navigate manually:**
1. Go to https://supabase.com/dashboard
2. Select project: **solomonresearch's Project** (pgprhlzpzegwfwcbsrww)
3. Click **Authentication** in the left sidebar
4. Click **URL Configuration**

### 2. Configure Site URL

**Site URL** is the main URL where your application is hosted.

1. Find the **Site URL** field
2. Replace the current value with:
   ```
   https://www.spezi.space
   ```
3. Click **Save**

**Note:** Don't include a trailing slash (`/`)

### 3. Configure Redirect URLs

**Redirect URLs** are the allowed URLs that Supabase can redirect to after authentication.

1. Find the **Redirect URLs** section
2. Click **Add URL** or edit existing entries
3. Add the following URLs (one per line):
   ```
   https://www.spezi.space
   https://www.spezi.space/*
   https://www.spezi.space/**
   http://localhost:5173
   http://localhost:5173/*
   ```

**Why include localhost?**
- Allows you to test authentication locally during development
- Production emails will still redirect to www.spezi.space

4. Click **Save**

### 4. Configure Additional Redirect URLs (Optional but Recommended)

If you have preview deployments or staging environments:

```
https://*.vercel.app
https://*.spezi.space
```

This allows authentication to work on Vercel preview deployments.

### 5. Verify Email Templates

The email confirmation link will automatically use the Site URL you configured.

**To verify:**
1. Go to **Authentication** → **Email Templates**
2. Click **Confirm signup**
3. The template should reference `{{ .ConfirmationURL }}`
4. This variable will now use `https://www.spezi.space` as the base

**No changes needed to the template!** The URL is automatically generated based on your Site URL setting.

## Complete Configuration Example

After configuration, your settings should look like this:

### Site URL
```
https://www.spezi.space
```

### Redirect URLs
```
https://www.spezi.space
https://www.spezi.space/*
https://www.spezi.space/**
http://localhost:5173
http://localhost:5173/*
https://*.vercel.app
```

## Testing the Configuration

### Test Email Confirmation Flow:

1. **Sign up a new user:**
   - Go to https://www.spezi.space
   - Click "Sign up"
   - Enter email and password
   - Submit the form

2. **Check email:**
   - You should receive a confirmation email
   - The subject will be: "Confirm Your Email" (or your custom subject)
   - Click the confirmation link

3. **Verify redirect:**
   - After clicking, you should be redirected to: `https://www.spezi.space`
   - You should see the login page
   - The URL should be your production domain, not localhost

4. **Login:**
   - Enter your credentials
   - You should be redirected to the dashboard

### Test Locally (Development):

1. Update your local `.env` file if needed (should already be correct):
   ```env
   VITE_SUPABASE_URL=https://pgprhlzpzegwfwcbsrww.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Run dev server:
   ```bash
   cd client
   npm run dev
   ```

3. Test signup at `http://localhost:5173`
   - Email confirmation links will still go to production (www.spezi.space)
   - This is expected behavior with current configuration

**To test email confirmations locally:**
- Temporarily set Site URL to `http://localhost:5173`
- Test your flow
- **Don't forget to change it back to `https://www.spezi.space` when done!**

## Troubleshooting

### Email confirmation links go to localhost

**Problem:** Links in confirmation emails point to `http://localhost:3000`

**Solution:**
1. Check Site URL is set to `https://www.spezi.space`
2. Click **Save** after making changes
3. Wait 1-2 minutes for changes to propagate
4. Send a new signup request (old emails will still have old links)

### "Invalid redirect URL" error after clicking confirmation link

**Problem:** The redirect URL is not in the allowed list

**Solution:**
1. Add `https://www.spezi.space/**` to Redirect URLs
2. Make sure there are no typos (check for `http` vs `https`)
3. Ensure no trailing slashes
4. Click **Save**

### Users see error page after confirming email

**Problem:** Site URL mismatch or app not handling auth callback

**Solution:**
1. Verify Site URL matches your production domain exactly
2. Check that your React app is properly handling the auth callback
3. Verify environment variables are set in Vercel
4. Check browser console for errors

### Email confirmations work on production but not locally

**Expected behavior!**
- Site URL is set to production
- Confirmation emails redirect to production
- To test locally, temporarily change Site URL to `http://localhost:5173`
- **Remember to change it back!**

## Security Best Practices

✅ **Do:**
- Use HTTPS for all production URLs
- Keep localhost URLs for development only
- Use wildcard patterns carefully (e.g., `*.vercel.app` for previews)
- Remove old/unused redirect URLs

❌ **Don't:**
- Don't use HTTP for production URLs
- Don't add untrusted domains to redirect URLs
- Don't share your Site URL configuration publicly
- Don't forget to save changes after editing

## Advanced Configuration

### Custom Domains

If you add more domains (e.g., `app.spezi.space`):

1. Add to Redirect URLs:
   ```
   https://app.spezi.space
   https://app.spezi.space/**
   ```

2. Update Site URL if this becomes your primary domain

### Preview Deployments (Vercel)

To allow authentication on Vercel preview deployments:

```
https://*-spezi01.vercel.app
https://*.vercel.app
```

This allows any Vercel preview URL to work with authentication.

### Multiple Environments

For staging/development environments:

**Option 1: Separate Supabase Projects**
- Create separate Supabase projects for dev/staging/production
- Each has its own URL configuration
- Recommended for production apps

**Option 2: Multiple Redirect URLs**
- Add all environment URLs to one project
- Less secure but simpler for small projects

## Reference Links

| Resource | URL |
|----------|-----|
| Supabase URL Configuration | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/url-configuration |
| Email Templates | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/templates |
| Authentication Settings | https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/settings |
| Production App | https://www.spezi.space |
| Supabase Docs | https://supabase.com/docs/guides/auth/redirect-urls |

## Summary Checklist

Before going live, verify:

- [ ] Site URL set to `https://www.spezi.space`
- [ ] Redirect URLs include `https://www.spezi.space/**`
- [ ] Test signup flow on production
- [ ] Verify email confirmation redirects correctly
- [ ] Check login works after email confirmation
- [ ] Remove any test/unused redirect URLs
- [ ] Environment variables set in Vercel
- [ ] Custom email template configured (optional)

## Need Help?

1. Check this guide step by step
2. Verify URLs are exact (no typos, correct protocol)
3. Check Supabase logs: Authentication → Logs
4. Test in incognito mode to avoid cached credentials
5. Check browser console for errors

---

**Current Configuration:**
- **Site URL:** `https://www.spezi.space`
- **Project:** pgprhlzpzegwfwcbsrww
- **Region:** EU North (Stockholm)
- **Updated:** 2025-10-25
