/*
 * WILD CHILD — site configuration
 * Everything you need to edit (brand, links, shop, products) lives here.
 * See SHOP_SETUP.md for how to connect the shop to Shopify + Printful.
 */
window.WC_CONFIG = {
  brand: {
    name: "WILD CHILD",
    show: "The Sunday Recovery Show",
    tagline: "Work hard. Play harder. Recover smarter.",
    email: "hello@wildchildpodcast.com",
  },

  // Where people can listen — replace "#" with your real show URLs.
  listen: {
    spotify: "#",
    apple: "#",
    youtube: "#",
    deezer: "#",
  },

  social: {
    instagram: "#",
    tiktok: "#",
    youtube: "#",
  },

  // Newsletter: paste a form endpoint (Mailchimp, Brevo, ConvertKit, Formspree...).
  // Leave empty to keep demo mode (shows a thank-you message only).
  newsletterEndpoint: "",

  /*
   * SHOP — headless Shopify checkout + Printful print-on-demand dropshipping.
   * 1. Create a Shopify store and install the Printful app.
   * 2. Design products in Printful and push them to Shopify.
   * 3. Put your store domain below and each size's Shopify *variant ID* in the products list.
   * While `domain` is empty, the shop runs in demo mode (cart works, checkout is simulated).
   */
  shop: {
    domain: "", // e.g. "wildchild-store.myshopify.com"
    currency: "EUR",
    locale: "fr-FR",
    freeShippingFrom: 60,
  },

  // variants: { SIZE: "SHOPIFY_VARIANT_ID" } — leave IDs empty in demo mode.
  products: [
    {
      id: "sore-sorry-tee",
      name: "Sore & Sorry Tee",
      type: "tee",
      category: "apparel",
      price: 32,
      color: "#fff8ee",
      ink: "#0f0e17",
      print: "SORE & SORRY",
      badge: "Bestseller",
      description: "Heavyweight organic cotton tee. For the Sunday after the Saturday.",
      variants: { S: "", M: "", L: "", XL: "", XXL: "" },
    },
    {
      id: "recovery-hoodie",
      name: "Recovery Club Hoodie",
      type: "hoodie",
      category: "apparel",
      price: 59,
      color: "#0f0e17",
      ink: "#c6f432",
      print: "RECOVERY CLUB",
      badge: "New",
      description: "Brushed fleece, oversized fit. Official uniform of the Sunday couch.",
      variants: { S: "", M: "", L: "", XL: "", XXL: "" },
    },
    {
      id: "wild-child-cap",
      name: "Wild Child Dad Cap",
      type: "cap",
      category: "accessories",
      price: 28,
      color: "#ff6b35",
      ink: "#fff8ee",
      print: "WILD CHILD",
      badge: "",
      description: "Embroidered washed-cotton cap. Hides the hangover, shows the vibe.",
      variants: { "One size": "" },
    },
    {
      id: "monday-reset-mug",
      name: "Monday Reset Mug",
      type: "mug",
      category: "home",
      price: 18,
      color: "#fff8ee",
      ink: "#ff3d7f",
      print: "MONDAY RESET",
      badge: "",
      description: "11oz ceramic. Coffee first, emails second.",
      variants: { "11oz": "", "15oz": "" },
    },
    {
      id: "hydrate-bottle",
      name: "Hydrate or Die Bottle",
      type: "bottle",
      category: "accessories",
      price: 29,
      color: "#c6f432",
      ink: "#0f0e17",
      print: "HYDRATE",
      badge: "Essential",
      description: "Insulated stainless-steel bottle. Water between every drink. Trust us.",
      variants: { "750ml": "" },
    },
    {
      id: "swipe-report-tote",
      name: "Swipe Report Tote",
      type: "tote",
      category: "accessories",
      price: 22,
      color: "#ff3d7f",
      ink: "#fff8ee",
      print: "SWIPE REPORT",
      badge: "",
      description: "Heavy canvas tote for gym clothes, date-night outfit, or both.",
      variants: { "One size": "" },
    },
    {
      id: "scoreboard-tee",
      name: "Scoreboard Tee",
      type: "tee",
      category: "apparel",
      price: 32,
      color: "#ff6b35",
      ink: "#0f0e17",
      print: "SCOREBOARD",
      badge: "",
      description: "Soft-wash cotton tee for the ones who never skip leg day (only Sundays).",
      variants: { S: "", M: "", L: "", XL: "" },
    },
    {
      id: "sunday-hoodie",
      name: "Every Sunday Hoodie",
      type: "hoodie",
      category: "apparel",
      price: 59,
      color: "#ff3d7f",
      ink: "#0f0e17",
      print: "EVERY SUNDAY",
      badge: "Limited",
      description: "Heavy fleece hoodie. Same headache, new lessons.",
      variants: { S: "", M: "", L: "", XL: "" },
    },
  ],

  episodes: [
    {
      n: 4,
      title: "Ghosted after a 5-a-side",
      desc: "Scored twice, matched once, got ghosted by Sunday noon. Plus: the 3-drink rule that actually works.",
      length: "47 min",
      date: "Sun · Week 4",
      tags: ["dating", "sport"],
    },
    {
      n: 3,
      title: "Half-marathon, full hangover",
      desc: "Can you run a race the morning after a birthday? We tried. Science and shame included.",
      length: "52 min",
      date: "Sun · Week 3",
      tags: ["sport", "hangover"],
    },
    {
      n: 2,
      title: "The Monday Reset protocol",
      desc: "Sleep, electrolytes, meal prep and a phone detox: our 5-step plan to survive Monday after a big weekend.",
      length: "44 min",
      date: "Sun · Week 2",
      tags: ["balance"],
    },
    {
      n: 1,
      title: "Welcome to the Wild Child",
      desc: "Who we are, why Sunday, and the weekend that made us start this podcast.",
      length: "39 min",
      date: "Sun · Week 1",
      tags: ["story"],
    },
  ],
};
