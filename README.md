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

1. Create a new Vercel project and import this folder (framework: “Other”).
2. Set the output directory to the project root; no build command is required.
3. Optionally claim the domain `palacioqr.vercel.app` (or update `landingUrl` to whichever domain Vercel assigns).
4. After deployment finishes, test the QR on a phone to make sure it opens the live site.

Because the QR encodes only the URL, you can update the UI in this repo and redeploy without reprinting the code, as long as the deployed URL stays the same.

