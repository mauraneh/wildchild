import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Product } from '../core/site.config';
import { mockupSvg } from './mockup';

/** Displays the SVG mockup of a product. The SVG is built from our own config with escaped text. */
@Component({
  selector: 'app-mockup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block;width:100%;height:100%', '[innerHTML]': 'svg()' },
  template: '',
})
export class Mockup {
  private readonly sanitizer = inject(DomSanitizer);
  readonly product = input.required<Product>();
  protected readonly svg = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(mockupSvg(this.product())));
}
