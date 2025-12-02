# Palacio QR Portal

Simple static landing page that pairs with a printable QR code. When guests scan the QR, they see a UI with quick actions for WhatsApp support and Wi-Fi access. You can view the page locally by opening `index.html` and later deploy it to Vercel without changing the QR target URL.

## Project structure

- `index.html` – main UI, loads `config.js` for dynamic details
- `styles.css` – visual design for the landing card and Wi-Fi modal
- `app.js` – button logic, clipboard helpers, modal handling
- `config.js` – single source of truth for WhatsApp number, Wi-Fi info, and landing URL
- `assets/qr-code.png` – QR that should be printed and displayed
- `scripts/generate-qr.js` – Node script to regenerate the QR when the landing URL changes

## Customize your details

Update `config.js` with your Wi-Fi SSID/password and any copy tweaks. The provided WhatsApp number is already set to `+62 612 203 4558`. The QR currently points to `https://palacioqr.vercel.app`; you can change this later, but remember to regenerate the QR image if you do.

```js
wifi: {
  ssid: "PalacioGuest",
  password: "securepassword",
  security: "WPA2"
}
```

## Viewing locally

Just double-click `index.html` or open it in a browser. All assets are relative, so no dev server is required.

## Regenerating the QR code

1. Install dependencies (Node.js 18+):
   ```
   npm install
   ```
2. Update `landingUrl` in `config.js` if needed.
3. Run:
   ```
   npm run generate:qr
   ```
The PNG in `assets/qr-code.png` will be overwritten.

If you cannot run Node locally, use any online QR generator with the same `landingUrl`.

## Deploying to Vercel

### Quick Deploy

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New..."** → **"Project"**
4. Import your Git repository
5. Vercel will auto-detect it as a static site
6. Click **"Deploy"**

### Optional: Configure Supabase (for Newsletter Database Storage)

The site works perfectly without Supabase. To enable database storage for newsletter signups:

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com)
2. **Get Credentials**: Settings → API → Copy your Project URL and anon key
3. **Add to Vercel**: 
   - Go to your Vercel project → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Apply to Production, Preview, and Development
4. **Create Database Table**: See `supabase-setup.md` for SQL schema

**See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for detailed deployment guide.**

### Custom Domain

After deployment, add a custom domain in Vercel Settings → Domains. Update the QR code if you change domains.

Because the QR encodes only the URL, you can update the UI in this repo and redeploy without reprinting the code, as long as the deployed URL stays the same.


