# Vercel Deployment Guide

This guide will help you deploy the Palacio Blanco QR Landing Page to Vercel with Supabase integration.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [Supabase account](https://supabase.com) (optional, for newsletter functionality)
3. Git repository with your code

## Deployment Steps

### 1. Push Code to Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GIT_REPO_URL
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect it as a static site
5. Click **"Deploy"**

### 3. Configure Environment Variables (Optional - for Newsletter)

If you want the newsletter to save to Supabase:

#### In Supabase:

1. Go to your [Supabase project dashboard](https://supabase.com/dashboard)
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOi...`)

#### In Vercel:

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Make sure to add them for **Production**, **Preview**, and **Development**
5. Click **"Save"**
6. Redeploy your project

### 4. Set Up Supabase Database (Optional)

If you added Supabase environment variables, create the database table:

```sql
-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anon users
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Optional: Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated reads" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (true);
```

## Vercel Configuration

The project includes a `vercel.json` file with optimal settings:

```json
{
  "buildCommand": "echo 'No build needed for static site'",
  "outputDirectory": ".",
  "framework": null,
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## Features

### ✅ Works Without Supabase
The site will work perfectly fine without Supabase configured. Newsletter submissions will:
- Show success message to users
- Log data to browser console
- Gracefully handle missing credentials

### ✅ Enhanced with Supabase
When Supabase is configured:
- Newsletter submissions are saved to database
- Email validation prevents duplicates
- Data is stored securely with RLS policies

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `qr.palacioblanco.mx`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

## Environment-Specific URLs

After deployment:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## Troubleshooting

### Newsletter Not Saving to Database

1. Check Vercel environment variables are set correctly
2. Verify Supabase table exists and RLS policies are correct
3. Check browser console for error messages
4. Ensure anon key has INSERT permissions

### Site Not Loading

1. Check deployment logs in Vercel dashboard
2. Verify all files are committed to Git
3. Ensure no build errors in deployment

## Local Development with Environment Variables

To test locally with Supabase:

1. Create `.env.local` file (not committed to Git):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

2. Use a local server that supports environment variables:
   ```bash
   npm install -g vite
   vite
   ```

   Or use the simple Python server (without env vars):
   ```bash
   python -m http.server 8000
   ```

## Security Notes

- ✅ **anon/public key** is safe to expose in frontend code
- ✅ Row Level Security (RLS) protects your database
- ❌ **Never** expose your `service_role` key in frontend
- ✅ All sensitive operations should use RLS policies

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase dashboard for table structure
4. Review `supabase-setup.md` for detailed Supabase configuration

## Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GIT_REPO_URL)

---

**Note**: The site works perfectly without Supabase. Adding Supabase is optional and only enhances the newsletter functionality with database storage.

