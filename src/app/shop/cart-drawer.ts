import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { UiService } from '../core/ui.service';
import { Mockup } from '../shared/mockup.component';
import { MoneyPipe } from '../shared/money.pipe';

@Component({
  selector: 'app-cart-drawer',
  imports: [Mockup, MoneyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-drawer.html',
})
export class CartDrawer {
  protected readonly cart = inject(CartService);
  protected readonly ui = inject(UiService);
  protected readonly demoNote = signal('');
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  constructor() {
    effect(() => {
      if (this.ui.cartOpen()) setTimeout(() => this.closeBtn().nativeElement.focus(), 50);
      else this.demoNote.set('');
    });
  }

  protected checkout(): void {
    const url = this.cart.checkoutUrl();
    if (url) {
      window.location.href = url;
      return;
    }
    this.demoNote.set('Demo mode: connect your Shopify store + variant IDs in src/app/core/site.config.ts to take real orders (see SHOP_SETUP.md).');
  }
}
