import { Pipe, PipeTransform, inject } from '@angular/core';
import { SITE } from '../core/site.config';
import { I18nService } from '../i18n/i18n.service';

const formatters = new Map<string, Intl.NumberFormat>();
const formatter = (locale: string) => {
  let f = formatters.get(locale);
  if (!f) {
    f = new Intl.NumberFormat(locale, { style: 'currency', currency: SITE.shop.currency });
    formatters.set(locale, f);
  }
  return f;
};

/** Formats a price in the shop currency, using the current language's number format. */
@Pipe({ name: 'money', pure: false })
export class MoneyPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: number): string {
    return formatter(this.i18n.t().meta.locale).format(value);
  }
}
