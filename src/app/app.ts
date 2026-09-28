import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiService } from './core/ui.service';
import { I18nService } from './i18n/i18n.service';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { CartDrawer } from './shop/cart-drawer';
import { ProductModal } from './shop/product-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CartDrawer, ProductModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
})
export class App {
  protected readonly ui = inject(UiService);
  protected readonly i18n = inject(I18nService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.ui.closeAll();
    this.ui.menuOpen.set(false);
  }
}
