# How to Customize Supabase Email Confirmation Template

## Step-by-Step Instructions

### 1. Access Email Templates

1. Go to your Supabase dashboard:
   https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww

2. Navigate to **Authentication** → **Email Templates** in the left sidebar
   Direct link: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/templates

### 2. Select Confirm Signup Template

1. Click on **"Confirm signup"** in the templates list
2. You'll see the default email template editor

### 3. Apply the Custom Template

**Option A: Copy from file**
1. Open the file: `/Developer/email-template.html`
2. Copy the entire HTML content
3. Paste it into the Supabase email template editor
4. Click **Save**

**Option B: Use the text below**

Copy and paste this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Spezi</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Welcome to Spezi!</h1>
                            <p style="margin: 15px 0 0; color: #f0f0f0; font-size: 18px; font-weight: 500;">No, hai la treaba!</p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 40px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello there! 👋
                            </p>
                            <p style="margin: 0 0 25px; color: #555555; font-size: 15px; line-height: 1.6;">
                                Thank you for signing up to Spezi. We're excited to have you on board! To get started, please confirm your email address by clicking the button below.
                            </p>

                            <!-- Confirmation Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}"
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                            Confirm Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0 15px; color: #555555; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0 0 25px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; word-wrap: break-word; color: #667eea; font-size: 13px;">
                                {{ .ConfirmationURL }}
                            </p>

                            <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.5;">
                                This link will expire in 24 hours. If you didn't create an account with Spezi, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e1e8ed;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                                Questions? Need help?
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Spezi. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

### 4. Customize Email Subject (Optional)

In the same template editor, you can also change the subject line:

**Default:** `Confirm Your Signup`

**Suggested:** `Welcome to Spezi - Confirm Your Email 🚀`

### 5. Test the Email

1. After saving the template, test it by signing up a new user
2. Check your email inbox
3. You should see the beautifully formatted email with:
   - Purple/blue gradient header
   - "Welcome to Spezi!" heading
   - "No, hai la treaba!" subheading
   - Professional confirmation button
   - Responsive design that works on mobile

## Email Template Features

✅ **Professional Design:**
- Matches your app's purple/blue gradient theme
- Clean, modern layout
- Fully responsive (mobile-friendly)

✅ **Romanian Touch:**
- Includes "No, hai la treaba!" (Let's get to work!)
- Welcoming and energetic tone

✅ **User-Friendly:**
- Clear call-to-action button
- Fallback link for email clients that don't support buttons
- Expiration notice (24 hours)

✅ **Accessible:**
- Works in all major email clients
- Graceful degradation for older clients
- Screen reader compatible

## Available Template Variables

Supabase provides these variables you can use:

- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Token }}` - The confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .RedirectTo }}` - Redirect destination

## Additional Email Templates to Customize

While you're in the Email Templates section, you might want to customize:

1. **Magic Link** - For passwordless login
2. **Change Email Address** - When users update their email
3. **Reset Password** - For password recovery

Use the same design style for consistency!

## Troubleshooting

**Email not sending?**
1. Check your Supabase plan (free tier has email limits)
2. Verify SMTP settings in Auth > Settings
3. Check spam/junk folder

**Template not updating?**
1. Clear browser cache
2. Make sure you clicked "Save"
3. Wait a few minutes for changes to propagate

**Links not working?**
1. Verify `{{ .ConfirmationURL }}` is correctly placed
2. Check Site URL in Auth settings

---

**Quick Access:**
- Email Templates: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/templates
- Auth Settings: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/auth/url-configuration
