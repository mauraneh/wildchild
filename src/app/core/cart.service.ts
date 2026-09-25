import { Injectable, computed, effect, signal } from '@angular/core';
import { Product, SITE } from './site.config';

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
  readonly freeShippingProgress = computed(() => Math.min(100, (this.total() / SITE.shop.freeShippingFrom) * 100));

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
    this.items.update((items) => {
      const found = items.find((i) => i.id === id && i.variant === variant);
      return found
        ? items.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
        : [...items, { id, variant, qty }];
    });
  }

  setQty(index: number, qty: number): void {
    this.items.update((items) =>
      qty <= 0 ? items.filter((_, i) => i !== index) : items.map((it, i) => (i === index ? { ...it, qty: Math.min(qty, MAX_QTY) } : it)),
    );
  }

  /**
   * Shopify cart permalink: https://STORE.myshopify.com/cart/VARIANT:QTY,VARIANT:QTY
   * Shopify takes payment; Printful (connected to Shopify) prints & ships with your branding.
   * Returns null while the shop is in demo mode (no domain or a missing variant ID).
   */
  checkoutUrl(): string | null {
    const lines = this.lines().map((l) => ({ id: l.product.variants[l.variant], qty: l.qty }));
    if (!SITE.shop.domain || !lines.length || lines.some((l) => !l.id)) return null;
    const path = lines.map((l) => `${encodeURIComponent(l.id)}:${l.qty}`).join(',');
    return `https://${SITE.shop.domain}/cart/${path}`;
  }

  private load(): CartItem[] {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
      return Array.isArray(raw) ? raw.filter((i: CartItem) => findProduct(i?.id) && i.qty > 0) : [];
    } catch {
      return [];
    }
  }
}
