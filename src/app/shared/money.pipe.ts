import { Pipe, PipeTransform } from '@angular/core';
import { SITE } from '../core/site.config';

const formatter = new Intl.NumberFormat(SITE.shop.locale, { style: 'currency', currency: SITE.shop.currency });

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return formatter.format(value);
  }
}
