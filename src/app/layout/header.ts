import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/cart.service';
import { SITE } from '../core/site.config';
import { UiService } from '../core/ui.service';
import { I18nService } from '../i18n/i18n.service';
import { LangSwitch } from './lang-switch';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LangSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
})
export class Header {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  protected readonly i18n = inject(I18nService);
  protected readonly site = SITE;
  protected readonly links = computed(() => {
    const nav = this.i18n.t().nav;
    return [
      { label: nav.story, fragment: 'story' },
      { label: nav.show, fragment: 'format' },
      { label: nav.episodes, fragment: 'episodes' },
      { label: nav.hosts, fragment: 'hosts' },
      { label: nav.ask, fragment: 'ask' },
    ];
  });

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1120) this.ui.menuOpen.set(false);
  }
}
