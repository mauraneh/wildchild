import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, SITE } from '../../core/site.config';
import { UiService } from '../../core/ui.service';
import { I18nService } from '../../i18n/i18n.service';
import { Mockup } from '../../shared/mockup.component';
import { MoneyPipe } from '../../shared/money.pipe';

type Filter = Category | 'all';

@Component({
  selector: 'app-shop',
  imports: [Mockup, MoneyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop.html',
})
export class Shop {
  protected readonly ui = inject(UiService);
  protected readonly i18n = inject(I18nService);
  protected readonly freeShippingFrom = SITE.shop.freeShippingFrom;
  protected readonly launched = SITE.launched;
  protected readonly filters: Filter[] = ['all', 'apparel', 'accessories', 'home'];
  protected readonly filter = signal<Filter>('all');
  protected readonly products = computed(() =>
    SITE.products.filter((p) => this.filter() === 'all' || p.category === this.filter()),
  );

  constructor() {
    this.i18n.pageTitle.set('shopTitle');
  }
}
