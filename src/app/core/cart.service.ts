import { Injectable, computed, effect, signal } from '@angular/core';
import { Product, SHOPIFY_DOMAIN, SHOPIFY_ID, SITE } from './site.config';

export interface CartItem {
  id: string;
  variant: string;
  qty: number;
}

export interface CartLine extends CartItem {
  product: Product;
}

const CART_KEY = 'wc_cart_v1';
const MAX_QTY = 20;

export const findProduct = (id: string): Product | undefined => SITE.products.find((p) => p.id === id);

/** A cart line is only valid if the product is still on sale and the size exists. */
const isValidItem = (i: unknown): i is CartItem => {
  if (!i || typeof i !== 'object') return false;
  const { id, variant, qty } = i as Record<string, unknown>;
  const product = typeof id === 'string' ? findProduct(id) : undefined;
  return !!product && product.variants.some((v) => v.size === variant) && Number.isInteger(qty) && (qty as number) >= 1 && (qty as number) <= MAX_QTY;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>(this.load());

  readonly lines = computed<CartLine[]>(() =>
    this.items().flatMap((i) => {
      const product = findProduct(i.id);
      return product ? [{ ...i, product }] : [];
    }),
  );
  readonly count = computed(() => this.lines().reduce((s, l) => s + l.qty, 0));
  readonly total = computed(() => this.lines().reduce((s, l) => s + l.product.price * l.qty, 0));
  readonly freeShippingLeft = computed(() => Math.max(0, SITE.shop.freeShippingFrom - this.total()));
  readonly freeShippingProgress = computed(() =>
    SITE.shop.freeShippingFrom > 0 ? Math.min(100, (this.total() / SITE.shop.freeShippingFrom) * 100) : 100,
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(this.items()));
      } catch {
        /* storage unavailable — cart still works for this visit */
      }
    });
  }

  add(id: string, variant: string, qty = 1): void {
    if (!isValidItem({ id, variant, qty })) return;
    this.items.update((items) => {
      const found = items.find((i) => i.id === id && i.variant === variant);
      return found
        ? items.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
        : [...items, { id, variant, qty }];
    });
  }

  setQty(index: number, qty: number): void {
    this.items.update((items) =>
      qty <= 0 ? items.filter((_, i) => i !== index) : items.map((it, i) => (i === index ? { ...it, qty: Math.min(Math.floor(qty), MAX_QTY) } : it)),
    );
  }

  /**
   * Shopify cart permalink: https://STORE.myshopify.com/cart/VARIANT:QTY,VARIANT:QTY
   * Shopify takes payment; Printful (connected to Shopify) prints & ships with your branding.
   * Returns null while the shop is in demo mode (no domain or a missing variant ID).
   */
  checkoutUrl(): string | null {
    const lines = this.lines().map((l) => ({ id: l.product.variants.find((v) => v.size === l.variant)?.shopifyId ?? '', qty: l.qty }));
    const domain = SITE.shop.domain;
    if (!domain || !SHOPIFY_DOMAIN.test(domain) || !lines.length || lines.some((l) => !l.id || !SHOPIFY_ID.test(l.id))) return null;
    const path = lines.map((l) => `${encodeURIComponent(l.id)}:${l.qty}`).join(',');
    return `https://${domain}/cart/${path}`;
  }

  private load(): CartItem[] {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
      return Array.isArray(raw) ? raw.filter(isValidItem).slice(0, 50) : [];
    } catch {
      return [];
    }
  }
}
