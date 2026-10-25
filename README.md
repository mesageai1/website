# MeSage AI website starter

A responsive one-page marketing website for MeSage AI.

## Files
- `home.html` — main website structure and page content
- `index.html` — entry point / redirect to `home.html`
- `how-it-works.html` — How It works (unified Customer & Business experiences)
- `customer-experience.html` — redirect to `how-it-works.html#customer`
- `your-experience.html` — redirect to `how-it-works.html#business`
- `demo4.html` — What we solve (problem-solution breakdown)
- `demo3.html` — Know More (workspace & platform capabilities tour)
- `about.html` — About us (mission, vision & core pillars)
- `demo2.html` — Contact (demo booking & schedule contact form)
- `header.css` — unified header styles across all pages
- `header.js` — unified responsive mobile menu script
- `styles.css` — responsive dark/futuristic styling
- `script.js` — mobile navigation and current year
- `assets/logoimg.png` — place your logo image here
- `assets/logogif.gif` — place your logo animation here (optional)

## Add your logo files
Your original paths are local to your Windows computer and are not accessible to a website visitor. Copy the files into this project's `assets` folder:
- `C:\Users\Ganesh\Downloads\logoimg.png` → `assets/logoimg.png`
- `C:\Users\Ganesh\Downloads\logogif.gif` → `assets/logogif.gif`

The static logo is already referenced in the header and footer. To use the animated logo instead, change the header/footer image source from `assets/logoimg.png` to `assets/logogif.gif` in `index.html`.

## Preview locally
Open `home.html` (or `index.html`) in Chrome. An internet connection is needed for the Google Fonts import; the page otherwise works as a static site.

## Publish
Upload the project files to your hosting's public web root (often `public_html`), keeping the `assets` folder alongside `index.html`.

## Before going live
- Replace `hello@mesage.ai` with your real business email.
- Replace illustrative metrics with real product metrics or keep the disclaimer.
- Connect the demo CTA to your booking/contact form.
- Add privacy policy, terms, cookie notice, and any applicable consent wording.
- The dashboard is a visual marketing mockup only; it does not connect to live messaging APIs. Actual WhatsApp/Meta/Telegram/email integrations, AI, CRM, campaigns, and AI calling require backend services, credentials, webhooks, permissions, and compliance setup.
