# Fix Vercel 404 Error

## Quick Fix Steps

### 1. Update vercel.json (Already Done ✅)
The `vercel.json` file has been updated to properly route requests to `index.html`.

### 2. Commit and Push Changes

Open Git Bash, Command Prompt, or VS Code terminal and run:

```bash
cd C:\Users\jetsk\Desktop\qrcode-palacio

# Add all changes
git add .

# Commit the fix
git commit -m "Fix: Update vercel.json for proper routing"

# Push to GitHub
git push origin main
```

**Note**: If your branch is named `master` instead of `main`, use:
```bash
git push origin master
```

### 3. Vercel Will Auto-Deploy

Vercel should automatically detect the push and redeploy. Wait 30-60 seconds.

---

## Alternative: Manual Fix in Vercel Dashboard

If you can't push via Git right now:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll to **Build & Development Settings**
5. Set:
   - **Framework Preset**: `Other`
   - **Build Command**: Leave empty
   - **Output Directory**: `.` (just a dot)
   - **Install Command**: Leave empty

6. Scroll to **Root Directory**
   - Make sure it's set to `./` (root)

7. Click **Save**

8. Go to **Deployments** tab
9. Click the three dots ⋮ on the latest deployment
10. Click **Redeploy**

---

## What Was Wrong?

The original `vercel.json` was configured for a build process, but this is a static site. The new configuration tells Vercel:
- Serve `index.html` at the root `/`
- Serve `index.html` for all routes (for SPA-like behavior)

## New vercel.json Content

```json
{
  "rewrites": [
    { "source": "/", "destination": "/index.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Verify It Works

After deployment completes:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. You should see the Palacio Blanco landing page
3. Test:
   - ✅ Service modals open
   - ✅ Newsletter form works
   - ✅ WiFi modal displays

---

## Still Getting 404?

### Check File Structure in Vercel

1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click **"Source"** tab
4. Verify you see:
   - ✅ `index.html`
   - ✅ `styles.css`
   - ✅ `app.js`
   - ✅ `config.js`
   - ✅ `supabase.js`

### If Files Are Missing

Make sure you committed and pushed all files:

```bash
# Check what's tracked by Git
git ls-files

# Should include:
# index.html
# styles.css
# app.js
# config.js
# supabase.js
# vercel.json
# etc.
```

### If Files Are There But Still 404

1. Delete the project from Vercel
2. Re-import from GitHub
3. During import:
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Leave as `./`
   - Don't set any build command
4. Deploy

---

## Environment Variables (Optional)

Once the 404 is fixed, if you want newsletter database storage:

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
3. Select: Production, Preview, Development
4. **Redeploy**

---

## Need Help?

If still getting 404 after trying these steps:
1. Check Vercel deployment logs for errors
2. Verify `index.html` is in the root of your repository
3. Make sure no `.vercelignore` file is excluding `index.html`
4. Try deleting and re-importing the project

Your site should work immediately after pushing the updated `vercel.json`! 🚀

