import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findProduct } from '../../core/cart.service';
import { Product, SITE } from '../../core/site.config';
import { Mockup } from '../../shared/mockup.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Mockup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  protected readonly site = SITE;
  protected readonly teaser = ['sore-sorry-tee', 'recovery-hoodie', 'wild-child-cap']
    .map(findProduct)
    .filter((p): p is Product => !!p);
  protected readonly newsletterMsg = signal('');

  protected async subscribe(ev: Event, input: HTMLInputElement): Promise<void> {
    ev.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.newsletterMsg.set('That email looks a bit hungover. Try again?');
      return;
    }
    if (SITE.newsletterEndpoint) {
      const body = new FormData();
      body.set('email', email);
      try {
        await fetch(SITE.newsletterEndpoint, { method: 'POST', body, mode: 'no-cors' });
      } catch {
        /* ignore network errors — still thank the user */
      }
    }
    input.value = '';
    this.newsletterMsg.set("You're in! See you Sunday ☀️");
  }
}
