import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Product } from '../core/site.config';
import { en } from './en';
import { es } from './es';
import { Dict, fr } from './fr';
import { pt } from './pt';

/** Order = order of the language switch. French first, English second. */
export const LANGS = ['fr', 'en', 'es', 'pt'] as const;
export type Lang = (typeof LANGS)[number];

const DICTS: Record<Lang, Dict> = { fr, en, es, pt };
const LANG_KEY = 'wc_lang';
const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

type PageTitle = 'homeTitle' | 'shopTitle';

/**
 * Runtime translations: French (default), English, Spanish, Portuguese.
 * Language priority: ?lang= in the URL → saved choice → browser language → English.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);

  readonly langs = LANGS.map((code) => ({ code, name: DICTS[code].langName }));
  readonly lang = signal<Lang>(this.detect());
  readonly t = computed(() => DICTS[this.lang()]);
  readonly pageTitle = signal<PageTitle>('homeTitle');

  constructor() {
    effect(() => {
      const t = this.t();
      this.doc.documentElement.lang = t.meta.htmlLang;
      this.doc.title = t.meta[this.pageTitle()];
      this.meta.updateTag({ name: 'description', content: t.meta.description });
      try {
        localStorage.setItem(LANG_KEY, this.lang());
      } catch {
        /* storage unavailable */
      }
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  productName(p: Product): string {
    return this.t().products[p.id]?.name ?? p.name;
  }

  productText(p: Product): { name: string; badge: string; description: string } {
    return this.t().products[p.id] ?? { name: p.name, badge: p.badge, description: p.description };
  }

  /** Size labels are stored in English in site.config.ts; only "One size" needs translating. */
  variantLabel(variant: string): string {
    return variant === 'One size' ? this.t().product.oneSize : variant;
  }

  private detect(): Lang {
    const fromUrl = new URLSearchParams(this.doc.location?.search ?? '').get('lang');
    if (isLang(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (isLang(saved)) return saved;
    } catch {
      /* storage unavailable */
    }
    const browser = (this.doc.defaultView?.navigator.languages ?? []).map((l) => l.slice(0, 2).toLowerCase());
    // Visitors whose browser speaks none of our languages get English, the international one.
    if (!browser.length) return 'fr';
    return browser.find(isLang) ?? 'en';
  }
}
