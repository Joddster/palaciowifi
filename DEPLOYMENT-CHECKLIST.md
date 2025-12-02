# Vercel Deployment Checklist ✅

## Pre-Deployment

- [ ] All service modals are working locally
- [ ] Newsletter form displays correctly
- [ ] WhatsApp CTAs are functional
- [ ] QR code points to correct URL
- [ ] `config.js` has correct WiFi credentials and WhatsApp number

## Vercel Setup

- [ ] Code pushed to Git repository
- [ ] Project imported to Vercel
- [ ] Initial deployment successful
- [ ] Site accessible at Vercel URL

## Optional: Supabase Integration

Only needed if you want newsletter signups saved to a database:

- [ ] Supabase project created
- [ ] Database table created (see `supabase-setup.md`)
- [ ] Environment variables added to Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Project redeployed after adding env vars
- [ ] Newsletter form tested and data saves to Supabase

## Post-Deployment

- [ ] Test QR code with phone - scans to live site
- [ ] All 9 service modals open correctly
- [ ] Newsletter form submits successfully
- [ ] WhatsApp CTAs open correct conversation
- [ ] WiFi modal displays credentials
- [ ] Site loads on mobile and desktop
- [ ] Custom domain configured (if applicable)

## Current Configuration Status

### ✅ Configured for Vercel Deployment

Your code is now properly configured to:

1. **Work without Supabase** - Newsletter will show success, data logged to console
2. **Enhance with Supabase** - When env vars are added, data saves to database
3. **Read from Vercel environment variables** - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. **Graceful degradation** - If Supabase fails, user still sees success message

### 📁 Key Files

- **`supabase.js`** - Handles Supabase connection and newsletter subscriptions
- **`vercel.json`** - Vercel deployment configuration
- **`.gitignore`** - Prevents committing sensitive files
- **`VERCEL-DEPLOYMENT.md`** - Complete deployment guide
- **`.env.local.example`** - Template for local development

### 🔐 Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Required? |
|----------|-------|-----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Optional |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Optional |

**Note**: Site works perfectly fine without these! They only enable database storage.

## Testing Newsletter

### Without Supabase (Default)
1. Fill out newsletter form
2. Click "Become a VIP Member"
3. Success message appears
4. Check browser console - data is logged there

### With Supabase (Enhanced)
1. Fill out newsletter form
2. Click "Become a VIP Member"
3. Success message appears
4. Check Supabase dashboard - new row in `newsletter_subscribers` table

## Troubleshooting

### Newsletter not saving to database?
- Check Vercel environment variables are set
- Verify Supabase table exists
- Check browser console for error messages
- Confirm RLS policies are correct

### Site not loading on Vercel?
- Check deployment logs in Vercel dashboard
- Verify all files are committed to Git
- Ensure `vercel.json` is in root directory

### Environment variables not working?
- Make sure variable names start with `VITE_`
- Redeploy after adding env vars
- Check they're enabled for Production, Preview, and Development

## Next Steps

1. **Deploy to Vercel** (site works immediately)
2. **Test on phone** (scan QR code)
3. **Optional**: Add Supabase for database storage
4. **Optional**: Configure custom domain

---

**Your site is ready to deploy to Vercel! 🚀**

