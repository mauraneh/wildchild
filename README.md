# WILD CHILD — The Sunday Recovery Show

Website + merch shop for **WILD CHILD**, the Sunday podcast about sport, dating,
hangovers and how to keep it all in balance after a week at work.

- **Brand, name & storytelling:** [`BRAND.md`](BRAND.md)
- **Shop / dropshipping setup:** [`SHOP_SETUP.md`](SHOP_SETUP.md)

## Stack

**Angular 22** — standalone components, signals, zoneless change detection,
new control flow (`@if` / `@for`), lazy-loaded shop route. Mobile-first CSS.

```
src/app/core/site.config.ts   ← edit this: brand, links, episodes, products, Shopify store
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
