import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IMAGE_PATH, Product } from '../core/site.config';
import { mockupSvg } from './mockup';

/**
 * Product visual: the photo uploaded in the admin if there is one, otherwise a generated SVG mockup.
 * The SVG only contains escaped text and validated hex colors (see mockup.ts), so bypassing the
 * sanitizer is safe; Angular's sanitizer would otherwise strip SVG entirely.
 */
@Component({
  selector: 'app-mockup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block;width:100%;height:100%' },
  template: `
    @if (image(); as src) {
      <img [src]="src" alt="" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block" />
    } @else {
      <div style="width:100%;height:100%" [innerHTML]="svg()"></div>
    }
  `,
})
export class Mockup {
  private readonly sanitizer = inject(DomSanitizer);
  readonly product = input.required<Product>();
  protected readonly image = computed(() => {
    const img = this.product().image;
    // Relative path so it works under the site's base href (/wildchild/).
    return img && IMAGE_PATH.test(img) ? img.replace(/^\//, '') : '';
  });
  protected readonly svg = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(mockupSvg(this.product())));
}
