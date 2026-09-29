import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { SITE } from '../core/site.config';
import { UiService } from '../core/ui.service';
import { I18nService } from '../i18n/i18n.service';
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
  protected readonly i18n = inject(I18nService);
  protected readonly showDemo = signal(false);
  protected readonly launched = SITE.launched;
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  constructor() {
    effect(() => {
      if (this.ui.cartOpen()) setTimeout(() => this.closeBtn().nativeElement.focus(), 50);
      else this.showDemo.set(false);
    });
  }

  protected checkout(): void {
    const url = this.cart.checkoutUrl();
    if (url) {
      window.location.href = url;
      return;
    }
    this.showDemo.set(true);
  }
}
