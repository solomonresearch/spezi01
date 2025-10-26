# Deployment Guide

## Environment Variables

This application requires the following environment variables to be set:

### For Local Development

Create a `.env.local` file in the `client/` directory with:

```
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variable:
   - **Name:** `VITE_CLAUDE_API_KEY`
   - **Value:** Your Claude API key from https://console.anthropic.com/
   - **Environment:** Select all (Production, Preview, Development)

4. Redeploy your application for the changes to take effect

## Getting a Claude API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

**IMPORTANT:** Never commit API keys to your git repository!

## Security Notes

- The `.env.local` file is already in `.gitignore` and should never be committed
- Always use environment variables for sensitive information
- Rotate your API keys regularly
- Monitor API usage in the Anthropic console
