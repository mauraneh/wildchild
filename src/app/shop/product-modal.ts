import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CartService } from '../core/cart.service';
import { SITE } from '../core/site.config';
import { UiService } from '../core/ui.service';
import { I18nService } from '../i18n/i18n.service';
import { Mockup } from '../shared/mockup.component';
import { MoneyPipe } from '../shared/money.pipe';

@Component({
  selector: 'app-product-modal',
  imports: [Mockup, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-modal.html',
})
export class ProductModal {
  protected readonly ui = inject(UiService);
  protected readonly i18n = inject(I18nService);
  private readonly cart = inject(CartService);
  protected readonly freeShippingFrom = SITE.shop.freeShippingFrom;
  protected readonly size = signal<string | null>(null);
  protected readonly sizes = computed(() => Object.keys(this.ui.product()?.variants ?? {}));
  protected readonly text = computed(() => {
    const p = this.ui.product();
    return p ? this.i18n.productText(p) : null;
  });
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  constructor() {
    effect(() => {
      const p = this.ui.product();
      if (!p) return;
      const sizes = Object.keys(p.variants);
      this.size.set(sizes.length === 1 ? sizes[0] : null);
      setTimeout(() => this.closeBtn().nativeElement.focus(), 50);
    });
  }

  protected add(): void {
    const p = this.ui.product();
    const size = this.size();
    const t = this.i18n.t().product;
    if (!p) return;
    if (!size) {
      this.ui.toast(t.pickSize);
      return;
    }
    this.cart.add(p.id, size);
    this.ui.toast(`${t.added} ${this.i18n.productName(p)} (${this.i18n.variantLabel(size)})`);
    this.ui.openCart();
  }
}
