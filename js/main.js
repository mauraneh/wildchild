/* WILD CHILD — site behaviour: nav, episodes, shop, cart, checkout */
(function () {
  "use strict";

  const CFG = window.WC_CONFIG;
  const CART_KEY = "wc_cart_v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const money = (n) =>
    new Intl.NumberFormat(CFG.shop.locale, { style: "currency", currency: CFG.shop.currency }).format(n);

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Product mockups (SVG, no image files needed) ---------- */
  function printText(text, x, y, maxW, ink, size) {
    const fs = Math.min(size, (maxW / Math.max(text.length, 1)) * 1.7);
    // Force the print width so it never spills off the product, whatever font actually loads.
    const w = Math.min(maxW, fs * 0.48 * text.length);
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs.toFixed(1)}" fill="${ink}" textLength="${w.toFixed(1)}" lengthAdjust="spacingAndGlyphs">${esc(text)}</text>`;
  }

  function mockup(p) {
    const { type, color, ink, print } = p;
    const stroke = "rgba(0,0,0,.18)";
    let body = "";
    switch (type) {
      case "tee":
        body = `<path d="M140 70 L100 82 L48 128 L78 176 L112 152 L112 340 L288 340 L288 152 L322 176 L352 128 L300 82 L260 70 C250 96 150 96 140 70 Z" fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M140 70 C150 96 250 96 260 70" fill="none" stroke="${stroke}" stroke-width="3"/>
          ${printText(print, 200, 215, 150, ink, 38)}
          <text x="200" y="245" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="${ink}" letter-spacing="3">WILD CHILD</text>`;
        break;
      case "hoodie":
        body = `<path d="M150 78 L100 96 L52 150 L66 300 L104 300 L112 176 L112 346 L288 346 L288 176 L296 300 L334 300 L348 150 L300 96 L250 78 Z" fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M150 78 C150 30 250 30 250 78 C240 118 160 118 150 78 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
          <path d="M165 82 C175 108 225 108 235 82" fill="none" stroke="${stroke}" stroke-width="3"/>
          <line x1="186" y1="104" x2="184" y2="150" stroke="${ink}" stroke-width="3"/><line x1="214" y1="104" x2="216" y2="150" stroke="${ink}" stroke-width="3"/>
          <path d="M140 290 L260 290 L270 340 L130 340 Z" fill="none" stroke="${stroke}" stroke-width="3"/>
          ${printText(print, 200, 230, 150, ink, 36)}`;
        break;
      case "cap":
        body = `<path d="M96 240 C96 140 304 140 304 240 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
          <path d="M96 240 C150 256 300 256 360 262 C350 286 240 290 96 262 Z" fill="${color}" stroke="${stroke}" stroke-width="3" filter="brightness(.9)"/>
          <path d="M200 146 L200 240" stroke="${stroke}" stroke-width="2"/>
          <circle cx="200" cy="146" r="6" fill="${ink}"/>
          ${printText(print, 200, 222, 150, ink, 30)}`;
        break;
      case "mug":
        body = `<path d="M270 160 C330 160 330 270 270 270" fill="none" stroke="${color}" stroke-width="22"/>
          <path d="M270 160 C330 160 330 270 270 270" fill="none" stroke="${stroke}" stroke-width="2"/>
          <rect x="110" y="120" width="170" height="200" rx="14" fill="${color}" stroke="${stroke}" stroke-width="3"/>
          <ellipse cx="195" cy="122" rx="85" ry="10" fill="rgba(0,0,0,.08)"/>
          ${printText(print, 195, 235, 140, ink, 40)}`;
        break;
      case "bottle":
        body = `<rect x="172" y="52" width="56" height="44" rx="10" fill="#0f0e17"/>
          <path d="M160 96 L240 96 L252 130 L252 340 C252 352 244 358 232 358 L168 358 C156 358 148 352 148 340 L148 130 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
          <g transform="rotate(-90 200 240)">${printText(print, 200, 254, 180, ink, 48)}</g>`;
        break;
      case "tote":
        body = `<path d="M150 150 C150 60 250 60 250 150" fill="none" stroke="${color}" stroke-width="14"/>
          <path d="M150 150 C150 60 250 60 250 150" fill="none" stroke="${stroke}" stroke-width="2"/>
          <rect x="90" y="140" width="220" height="220" rx="6" fill="${color}" stroke="${stroke}" stroke-width="3"/>
          ${printText(print, 200, 262, 170, ink, 40)}`;
        break;
    }
    const bg = color.toLowerCase() === "#0f0e17" ? "#2a2937" : "#1b1a26";
    return `<svg viewBox="0 0 400 400" role="img" aria-label="${esc(p.name)}" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${bg}"/>
      <circle cx="200" cy="210" r="150" fill="rgba(255,255,255,.04)"/>
      ${body}</svg>`;
  }

  /* ---------- Header / mobile menu ---------- */
  function initNav() {
    const toggle = $(".menu-toggle");
    const menu = $(".mobile-menu");
    if (!toggle || !menu) return;
    const set = (open) => {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("no-scroll", open);
    };
    toggle.addEventListener("click", () => set(!menu.classList.contains("open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
    window.addEventListener("resize", () => window.innerWidth >= 960 && set(false));
  }

  /* ---------- Config-driven links ---------- */
  function initLinks() {
    $$("[data-listen]").forEach((a) => (a.href = CFG.listen[a.dataset.listen] || "#"));
    $$("[data-social]").forEach((a) => (a.href = CFG.social[a.dataset.social] || "#"));
    $$("[data-email]").forEach((a) => {
      a.href = "mailto:" + CFG.brand.email;
      a.textContent = CFG.brand.email;
    });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Episodes ---------- */
  function renderEpisodes() {
    const list = $("#episode-list");
    if (!list) return;
    list.innerHTML = CFG.episodes
      .map(
        (e) => `<article class="episode">
          <div class="episode-num" aria-hidden="true">${String(e.n).padStart(2, "0")}</div>
          <div>
            <div class="episode-meta"><span>EP ${e.n}</span><span>${esc(e.date)}</span><span>${esc(e.length)}</span>${e.tags
              .map((t) => `<span class="tag">#${esc(t)}</span>`)
              .join("")}</div>
            <h3>${esc(e.title)}</h3>
            <p>${esc(e.desc)}</p>
          </div>
          <a class="btn btn-ghost play" href="${CFG.listen.spotify}" aria-label="Listen to episode ${e.n}">▶ Listen</a>
        </article>`
      )
      .join("");
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    $$("form[data-newsletter]").forEach((form) => {
      form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const msg = $(".form-msg", form.parentElement);
        const email = form.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          msg.textContent = "That email looks a bit hungover. Try again?";
          return;
        }
        if (CFG.newsletterEndpoint) {
          try {
            await fetch(CFG.newsletterEndpoint, { method: "POST", body: new FormData(form), mode: "no-cors" });
          } catch (_) {
            /* ignore network errors — still thank the user */
          }
        }
        form.reset();
        msg.textContent = "You're in! See you Sunday ☀️";
      });
    });
  }

  /* ---------- Cart state ---------- */
  const cart = {
    items: [],
    load() {
      try {
        this.items = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      } catch (_) {
        this.items = [];
      }
      this.items = this.items.filter((i) => CFG.products.some((p) => p.id === i.id));
    },
    save() {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(this.items));
      } catch (_) {
        /* storage unavailable — cart still works for this page view */
      }
      renderCart();
    },
    add(id, variant, qty = 1) {
      const found = this.items.find((i) => i.id === id && i.variant === variant);
      if (found) found.qty += qty;
      else this.items.push({ id, variant, qty });
      this.save();
    },
    setQty(index, qty) {
      if (qty <= 0) this.items.splice(index, 1);
      else this.items[index].qty = Math.min(qty, 20);
      this.save();
    },
    count() {
      return this.items.reduce((s, i) => s + i.qty, 0);
    },
    total() {
      return this.items.reduce((s, i) => s + product(i.id).price * i.qty, 0);
    },
  };

  const product = (id) => CFG.products.find((p) => p.id === id);

  /* ---------- Shared UI (drawer, modal, toast) injected once ---------- */
  function injectShell() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="overlay" data-close></div>
      <aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true">
        <div class="drawer-head">
          <h2 id="cart-title">Your bag</h2>
          <button class="icon-btn" data-close aria-label="Close bag">${ICON_X}</button>
        </div>
        <div class="drawer-body" id="cart-body"></div>
        <div class="drawer-foot" id="cart-foot"></div>
      </aside>
      <div class="modal" id="product-modal" role="dialog" aria-modal="true" aria-hidden="true"></div>
      <div class="toast" role="status" aria-live="polite"></div>`
    );
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeAll));
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  }

  const ICON_X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

  let lastFocus = null;
  function openPanel(el) {
    lastFocus = document.activeElement;
    $(".overlay").classList.add("open");
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const f = $("button, a, input", el);
    if (f) setTimeout(() => f.focus(), 50);
  }
  function closeAll() {
    $$(".drawer.open, .modal.open").forEach((el) => {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    });
    const ov = $(".overlay");
    if (ov) ov.classList.remove("open");
    if (!$(".mobile-menu.open")) document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }
  function openCart() {
    closeAll();
    renderCart();
    openPanel($("#cart"));
  }

  let toastTimer;
  function toast(text) {
    const t = $(".toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Cart rendering ---------- */
  function renderCart() {
    $$(".cart-count").forEach((el) => {
      el.textContent = cart.count();
      el.dataset.count = cart.count();
    });
    const body = $("#cart-body");
    const foot = $("#cart-foot");
    if (!body) return;

    if (!cart.items.length) {
      body.innerHTML = `<div class="cart-empty"><p>Your bag is emptier than your Sunday fridge.</p>
        <a class="btn btn-primary" href="shop.html">Shop the drop</a></div>`;
      foot.innerHTML = "";
      return;
    }

    const total = cart.total();
    const left = Math.max(0, CFG.shop.freeShippingFrom - total);
    const pct = Math.min(100, (total / CFG.shop.freeShippingFrom) * 100);

    body.innerHTML =
      `<div class="ship-bar">${
        left > 0 ? `You're <b>${money(left)}</b> away from free shipping` : `<b class="lime">Free shipping unlocked 🎉</b>`
      }<div class="track"><div class="fill" style="width:${pct}%"></div></div></div>` +
      cart.items
        .map((i, idx) => {
          const p = product(i.id);
          return `<div class="cart-item">
            <div class="thumb">${mockup(p)}</div>
            <div>
              <div class="name">${esc(p.name)}</div>
              <div class="variant">${esc(i.variant)}</div>
              <div class="qty">
                <button data-qty="${idx}" data-d="-1" aria-label="Decrease quantity">−</button>
                <span>${i.qty}</span>
                <button data-qty="${idx}" data-d="1" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="price">${money(p.price * i.qty)}<br><button class="remove" data-remove="${idx}">Remove</button></div>
          </div>`;
        })
        .join("");

    foot.innerHTML = `<div class="total-row"><span>Subtotal</span><span>${money(total)}</span></div>
      <p class="fine">Shipping & taxes calculated at checkout. Printed on demand, ships in 3–7 days.</p>
      <button class="btn btn-grad btn-block" id="checkout">Checkout →</button>
      <p class="demo-note" id="demo-note"></p>`;

    $$("[data-qty]", body).forEach((b) =>
      b.addEventListener("click", () => {
        const idx = +b.dataset.qty;
        cart.setQty(idx, cart.items[idx].qty + +b.dataset.d);
      })
    );
    $$("[data-remove]", body).forEach((b) => b.addEventListener("click", () => cart.setQty(+b.dataset.remove, 0)));
    $("#checkout").addEventListener("click", checkout);
  }

  /*
   * Checkout: builds a Shopify cart permalink
   *   https://STORE.myshopify.com/cart/VARIANT:QTY,VARIANT:QTY
   * Shopify handles payment; Printful (connected to Shopify) prints & ships with your branding.
   */
  function checkout() {
    const note = $("#demo-note");
    const lines = cart.items.map((i) => ({ id: product(i.id).variants[i.variant], qty: i.qty }));
    if (!CFG.shop.domain || lines.some((l) => !l.id)) {
      note.textContent =
        "Demo mode: connect your Shopify store + variant IDs in js/config.js to take real orders (see SHOP_SETUP.md).";
      return;
    }
    const path = lines.map((l) => `${encodeURIComponent(l.id)}:${l.qty}`).join(",");
    window.location.href = `https://${CFG.shop.domain}/cart/${path}`;
  }

  /* ---------- Shop grid ---------- */
  function productCard(p) {
    return `<button class="product" data-product="${p.id}" aria-label="${esc(p.name)}, ${money(p.price)}">
      <div class="product-media">${mockup(p)}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}</div>
      <div class="product-body">
        <span class="product-name">${esc(p.name)}</span>
        <span class="product-price">${money(p.price)}</span>
      </div>
    </button>`;
  }

  function renderProducts(filter = "all") {
    const grid = $("#product-grid");
    if (!grid) return;
    const limit = +grid.dataset.limit || Infinity;
    const list = CFG.products.filter((p) => filter === "all" || p.category === filter).slice(0, limit);
    grid.innerHTML = list.map(productCard).join("");
    $$("[data-product]", grid).forEach((b) => b.addEventListener("click", () => openProduct(b.dataset.product)));
  }

  function initFilters() {
    const chips = $$(".chip[data-filter]");
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
        renderProducts(c.dataset.filter);
      })
    );
  }

  function openProduct(id) {
    const p = product(id);
    const sizes = Object.keys(p.variants);
    let chosen = sizes.length === 1 ? sizes[0] : null;
    const modal = $("#product-modal");
    modal.setAttribute("aria-label", p.name);
    modal.innerHTML = `<button class="icon-btn modal-close" data-close aria-label="Close">${ICON_X}</button>
      <div class="modal-grid">
        <div class="modal-media">${mockup(p)}</div>
        <div class="modal-info">
          <span class="eyebrow">${esc(p.category)}</span>
          <h2>${esc(p.name)}</h2>
          <div class="modal-price">${money(p.price)}</div>
          <p>${esc(p.description)}</p>
          <div class="label" id="size-label">${sizes.length > 1 ? "Choose size" : "Size"}</div>
          <div class="sizes" role="radiogroup" aria-labelledby="size-label">
            ${sizes
              .map(
                (s) =>
                  `<button class="size" role="radio" aria-checked="${s === chosen}" data-size="${esc(s)}">${esc(s)}</button>`
              )
              .join("")}
          </div>
          <button class="btn btn-primary btn-block" id="add-to-bag">Add to bag</button>
          <div class="details">
            <span>✦ Printed on demand just for you — zero waste</span>
            <span>✦ Ships in 3–7 days · Free shipping from ${money(CFG.shop.freeShippingFrom)}</span>
            <span>✦ 30-day returns on misprints & damaged items</span>
          </div>
        </div>
      </div>`;
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeAll));
    $$(".size", modal).forEach((b) =>
      b.addEventListener("click", () => {
        chosen = b.dataset.size;
        $$(".size", modal).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      })
    );
    $("#add-to-bag", modal).addEventListener("click", () => {
      if (!chosen) {
        toast("Pick a size first 👕");
        return;
      }
      cart.add(p.id, chosen);
      closeAll();
      toast(`Added ${p.name} (${chosen})`);
      setTimeout(openCart, 450);
    });
    closeAll();
    openPanel(modal);
  }

  /* ---------- Hero / teaser mini mockups ---------- */
  function renderMinis() {
    $$("[data-mini]").forEach((el) => {
      const p = product(el.dataset.mini);
      if (p) el.innerHTML = mockup(p);
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    cart.load();
    injectShell();
    initNav();
    initLinks();
    renderEpisodes();
    initNewsletter();
    renderProducts();
    initFilters();
    renderMinis();
    renderCart();
  });
})();
