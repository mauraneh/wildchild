# WILD CHILD — The Sunday Recovery Show

Website + merch shop for **WILD CHILD**, the Sunday podcast about sport, dating,
hangovers and how to keep it all in balance after a week at work.

- **Brand, name & storytelling:** [`BRAND.md`](BRAND.md)
- **Shop / dropshipping setup:** [`SHOP_SETUP.md`](SHOP_SETUP.md)
- **Admin (episodes, merch, settings) & security:** [`ADMIN.md`](ADMIN.md), at `/admin`
- **Launch checklist & costs (pre-launch mode, RSS + Shopify auto-sync):** [`LAUNCH.md`](LAUNCH.md)

## Stack

**Angular 22** — standalone components, signals, zoneless change detection,
new control flow (`@if` / `@for`), lazy-loaded shop route. Mobile-first CSS.

### Languages

The site is in **French (default), English, Spanish and Portuguese**. Visitors
switch with the FR / EN / ES / PT buttons (header on desktop, menu on mobile,
footer). The first visit uses the browser language (English for any language
we don't cover); the choice is remembered. Share a link in a given language
with `?lang=en`, `?lang=es` or `?lang=pt`.

All texts are in `src/app/i18n/fr.ts`, `en.ts`, `es.ts` and `pt.ts`. They share one
TypeScript type, so the build fails if a translation is missing a key. To add
a language, copy `es.ts`, translate it, and register it in `i18n.service.ts`.

### Listener questions ("Pose ta question")

The home page has a form where listeners send a question for the show (topic,
question, optional nickname and e-mail, "keep me anonymous", on-air consent,
anti-spam honeypot).

- **Default (no setup):** the form opens the visitor's mail app with the
  question pre-filled, addressed to `brand.email`.
- **Recommended:** create a free form on [Formspree](https://formspree.io)
  and paste its URL in **Réglages → Formulaire « Pose ta question »** in the admin.
  Questions are then sent in one click and land in your inbox (with topic,
  language and anonymity choice), ready to pick for Sunday's episode.

```
src/app/i18n/                 ← edit this: all texts in FR / EN / ES / PT
src/content/*.json            ← episodes, products, settings (edit them from /admin)
src/app/core/site.config.ts   Content types + validation (also run by CI)
src/app/core/cart.service.ts  Cart (signals + localStorage) and Shopify checkout link
src/app/core/ui.service.ts    Menu / cart drawer / product sheet / toast state
src/app/layout/               Header (+ mobile menu) and footer
src/app/pages/home/           Podcast home (story, format, episodes, hosts, newsletter)
src/app/pages/shop/           Merch shop (filters, product grid)
src/app/shop/                 Cart drawer and product sheet
src/app/shared/               Product SVG mockups, money pipe
src/styles.css                Global mobile-first styles
public/                       Logo & favicon
```

## Develop

Requires **Node.js ≥ 22.22.3 or 24.15** (Angular 22 requirement).

```bash
npm install
npm start          # http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build in dist/wildchild/browser
```

## Deploy

`.github/workflows/pages.yml` tests, builds and publishes to GitHub Pages on
every push to `main`. In the GitHub repo: **Settings → Pages → Source: GitHub
Actions**. Netlify / Vercel / Cloudflare Pages also work: build command
`npm run build`, publish directory `dist/wildchild/browser`, and a SPA
fallback rewrite to `index.html`.
