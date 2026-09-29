import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { I18nService } from '../../i18n/i18n.service';
import { Mockup } from '../../shared/mockup.component';
import { AskQuestion } from './ask-question';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Mockup, AskQuestion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  protected readonly i18n = inject(I18nService);
  protected readonly site = SITE;
  protected readonly avatars = [
    { icon: '🏃', color: 'var(--lime)' },
    { icon: '💘', color: 'var(--pink)' },
    { icon: '🎙️', color: 'var(--sunrise)' },
  ];
  // The first three products in the admin's list are shown on the home page.
  protected readonly teaser = SITE.products.slice(0, 3);
  protected readonly newsletterState = signal<'invalid' | 'thanks' | null>(null);

  constructor() {
    this.i18n.pageTitle.set('homeTitle');
  }

  protected async subscribe(ev: Event, input: HTMLInputElement): Promise<void> {
    ev.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.newsletterState.set('invalid');
      return;
    }
    if (SITE.newsletterEndpoint) {
      const body = new FormData();
      body.set('email', email);
      body.set('lang', this.i18n.lang());
      try {
        await fetch(SITE.newsletterEndpoint, { method: 'POST', body, mode: 'no-cors' });
      } catch {
        /* ignore network errors — still thank the user */
      }
    }
    input.value = '';
    this.newsletterState.set('thanks');
  }
}
