import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Category, SITE } from '../../core/site.config';
import { UiService } from '../../core/ui.service';
import { Mockup } from '../../shared/mockup.component';
import { MoneyPipe } from '../../shared/money.pipe';

type Filter = Category | 'all';

@Component({
  selector: 'app-shop',
  imports: [Mockup, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop.html',
})
export class Shop {
  protected readonly ui = inject(UiService);
  protected readonly freeShippingFrom = SITE.shop.freeShippingFrom;
  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home', label: 'Home' },
  ];
  protected readonly filter = signal<Filter>('all');
  protected readonly products = computed(() =>
    SITE.products.filter((p) => this.filter() === 'all' || p.category === this.filter()),
  );
}
