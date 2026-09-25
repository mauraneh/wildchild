# Shop setup — branded dropshipping with print-on-demand

## The recommended stack

**Printful (print-on-demand) + Shopify (checkout) + this website (storefront).**

For a podcast brand, *print-on-demand* is the best form of dropshipping:

- **Your brand on everything** — your designs printed on the product, plus custom
  neck labels, branded packing slips, pack-ins (stickers, thank-you cards) and
  no supplier branding on the parcel (“white label”).
- **No stock, no upfront cost** — a product is only printed when someone buys it.
- **Quality you control** — order samples (Printful offers sample discounts)
  before you launch.
- **Fulfilment is automatic** — order paid on Shopify → sent to Printful →
  printed → shipped to the customer with tracking.

Classic “AliExpress” dropshipping is **not** recommended here: long shipping
times, no real branding, inconsistent quality — bad for a young community brand.

### Alternatives

| Option | When to choose it |
|---|---|
| **Printify** + Shopify | Lower base prices (many print partners), slightly less consistent quality/branding. |
| **Gelato** + Shopify | Production in 30+ countries → fast local shipping in Europe. |
| **Shopify only** (hosted theme) | If you prefer to run the whole site inside Shopify instead of this custom site. |
| **Stripe Payment Links** | Absolute cheapest start (no Shopify fee), but you forward orders to Printful manually. |

## Step by step

1. **Create a Shopify store** (Basic plan is enough, or the *Starter* plan if
   you only sell through external links/buttons).
2. **Install the Printful app** from the Shopify App Store and connect it.
3. In Printful, **design the products** (tees, hoodies, caps, mugs, bottles,
   totes…) with the Wild Child artwork, and enable:
   - Branding → custom **packing slip** with logo and message
   - Branding → **inside/outside labels** on apparel
   - Branding → **pack-ins** (e.g. a “Recovery Club” sticker)
4. **Push the products to Shopify** from Printful. Set your retail prices
   (aim for 35–50 % margin after Printful cost + shipping).
5. Get each **variant ID** from Shopify:
   Admin → Products → open a product → click a variant → the URL ends with
   `/variants/1234567890` — that number is the variant ID.
6. Edit **`js/config.js`**:
   ```js
   shop: { domain: "your-store.myshopify.com", currency: "EUR", ... },
   products: [
     { id: "sore-sorry-tee", ..., variants: { S: "44112233", M: "44112234", ... } },
   ]
   ```
7. Done. When a customer clicks **Checkout**, the site builds a Shopify cart
   link (`https://your-store.myshopify.com/cart/VARIANT:QTY,VARIANT:QTY`) and
   sends them to Shopify's secure checkout (cards, Apple Pay, Google Pay, Shop
   Pay). Printful receives the order automatically and ships it.

While `domain` is empty (or a variant ID is missing), the shop runs in **demo
mode**: browsing and cart work, checkout just shows a notice.

## Business checklist

- Legal pages on Shopify: terms, privacy, returns, shipping (Shopify can generate them).
- In France/EU: register a business (micro-entreprise is fine to start), mention
  the 14-day withdrawal right, and configure VAT in Shopify.
- Order one sample of every product before launch — use them for photos and
  for wearing on video episodes.
- Replace the SVG mockups with real photos/Printful mockups when ready (just
  swap the `mockup()` output for an `<img>` in `js/main.js`).
