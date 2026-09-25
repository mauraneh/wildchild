# WILD CHILD — The Sunday Recovery Show

Website + merch shop for **WILD CHILD**, the Sunday podcast about sport, dating,
hangovers and how to keep it all in balance after a week at work.

- **Brand, name & storytelling:** [`BRAND.md`](BRAND.md)
- **Shop / dropshipping setup:** [`SHOP_SETUP.md`](SHOP_SETUP.md)

## Stack

Plain HTML, CSS and JavaScript — no build step, loads fast on mobile.

```
index.html      Podcast home (story, format, episodes, hosts, newsletter)
shop.html       Merch shop (filters, product sheet, cart drawer)
css/style.css   Mobile-first styles
js/config.js    ← edit this: brand, links, episodes, products, Shopify store
js/main.js      Behaviour (menu, cart, checkout)
assets/         Logo & favicon
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

The repo includes a GitHub Pages workflow (`.github/workflows/pages.yml`).
In the GitHub repo: **Settings → Pages → Source: GitHub Actions**. Every push
to `main` publishes the site. Netlify / Vercel / Cloudflare Pages also work
out of the box (no build command, publish directory `/`).
