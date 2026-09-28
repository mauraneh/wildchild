import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { CartService } from './core/cart.service';
import { SITE } from './core/site.config';
import { routes } from './app.routes';
import { en } from './i18n/en';
import { es } from './i18n/es';
import { fr } from './i18n/fr';
import { I18nService } from './i18n/i18n.service';
import { pt } from './i18n/pt';
import { AskQuestion } from './pages/home/ask-question';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo span')?.textContent).toContain('WILD CHILD');
  });

  it('switches the whole page language', async () => {
    const fixture = TestBed.createComponent(App);
    const i18n = TestBed.inject(I18nService);
    const compiled = fixture.nativeElement as HTMLElement;

    for (const [lang, dict] of [['fr', fr], ['en', en], ['es', es], ['pt', pt]] as const) {
      i18n.setLang(lang);
      await fixture.whenStable();
      expect(compiled.querySelector('.nav a')?.textContent).toContain(dict.nav.story);
      expect(document.documentElement.lang).toBe(lang);
    }
  });
});

describe('Translations', () => {
  it('cover every product and episode in every language', () => {
    for (const dict of [fr, en, es, pt]) {
      for (const p of SITE.products) expect(dict.products[p.id]?.name).toBeTruthy();
      for (const e of SITE.episodes) expect(dict.episodeText[e.n]?.title).toBeTruthy();
    }
  });
});

describe('AskQuestion', () => {
  async function setup() {
    localStorage.clear();
    localStorage.setItem('wc_lang', 'fr');
    await TestBed.configureTestingModule({ imports: [AskQuestion] }).compileComponents();
    const fixture = TestBed.createComponent(AskQuestion);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await fixture.whenStable();
    };
    return { el, type, submit };
  }

  it('asks for more context when the question is too short', async () => {
    const { el, type, submit } = await setup();
    type('#ask-question', 'Help?');
    await submit();
    expect(el.querySelector('.ask-msg')?.textContent).toContain(fr.home.ask.tooShort);
  });

  it('requires on-air consent', async () => {
    const { el, type, submit } = await setup();
    type('#ask-question', 'How do I recover from a 10k and a date on the same Saturday?');
    await submit();
    expect(el.querySelector('.ask-msg')?.textContent).toContain(fr.home.ask.needConsent);
  });

  it('rejects an invalid optional e-mail', async () => {
    const { el, type, submit } = await setup();
    type('#ask-question', 'How do I recover from a 10k and a date on the same Saturday?');
    type('#ask-email', 'not-an-email');
    await submit();
    expect(el.querySelector('.ask-msg')?.textContent).toContain(fr.home.ask.invalidEmail);
  });

  it('falls back to a pre-filled e-mail when no endpoint is configured', async () => {
    const { el, type, submit } = await setup();
    type('#ask-question', 'How do I recover from a 10k and a date on the same Saturday?');
    const consent = el.querySelectorAll<HTMLInputElement>('.check input')[1];
    consent.checked = true;
    consent.dispatchEvent(new Event('change'));
    await submit();
    expect(el.querySelector('.ask-done')?.textContent).toContain(fr.home.ask.mailFallback);
  });
});

describe('CartService', () => {
  beforeEach(() => localStorage.clear());

  it('adds, merges and totals items', () => {
    const cart = TestBed.inject(CartService);
    cart.add('sore-sorry-tee', 'M');
    cart.add('sore-sorry-tee', 'M');
    cart.add('wild-child-cap', 'One size');
    expect(cart.count()).toBe(3);
    expect(cart.total()).toBe(32 * 2 + 28);
    cart.setQty(0, 0);
    expect(cart.count()).toBe(1);
  });

  it('stays in demo mode without a Shopify domain', () => {
    const cart = TestBed.inject(CartService);
    cart.add('sore-sorry-tee', 'M');
    expect(cart.checkoutUrl()).toBeNull();
  });
});
