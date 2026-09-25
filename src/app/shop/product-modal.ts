import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { CartService } from '../core/cart.service';
import { SITE } from '../core/site.config';
import { UiService } from '../core/ui.service';
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
  private readonly cart = inject(CartService);
  protected readonly freeShippingFrom = SITE.shop.freeShippingFrom;
  protected readonly size = signal<string | null>(null);
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  protected sizes(): string[] {
    const p = this.ui.product();
    return p ? Object.keys(p.variants) : [];
  }

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
    if (!p) return;
    if (!size) {
      this.ui.toast('Pick a size first 👕');
      return;
    }
    this.cart.add(p.id, size);
    this.ui.toast(`Added ${p.name} (${size})`);
    this.ui.openCart();
  }
}
