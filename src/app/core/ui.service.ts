import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Product } from './site.config';

/** Shared UI state: mobile menu, cart drawer, product sheet and toast. */
@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly doc = inject(DOCUMENT);
  private lastFocus: HTMLElement | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly menuOpen = signal(false);
  readonly cartOpen = signal(false);
  readonly product = signal<Product | null>(null);
  readonly toastText = signal('');
  readonly toastVisible = signal(false);
  readonly overlayOpen = computed(() => this.cartOpen() || !!this.product());

  constructor() {
    effect(() => {
      this.doc.body.classList.toggle('no-scroll', this.menuOpen() || this.overlayOpen());
    });
  }

  openCart(): void {
    this.rememberFocus();
    this.product.set(null);
    this.cartOpen.set(true);
  }

  openProduct(p: Product): void {
    this.rememberFocus();
    this.cartOpen.set(false);
    this.product.set(p);
  }

  closeAll(): void {
    const wasOpen = this.overlayOpen();
    this.cartOpen.set(false);
    this.product.set(null);
    if (wasOpen) this.lastFocus?.focus();
  }

  toast(text: string): void {
    this.toastText.set(text);
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 2200);
  }

  private rememberFocus(): void {
    if (!this.overlayOpen()) this.lastFocus = this.doc.activeElement as HTMLElement | null;
  }
}
