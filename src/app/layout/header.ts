import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/cart.service';
import { SITE } from '../core/site.config';
import { UiService } from '../core/ui.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
})
export class Header {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  protected readonly site = SITE;
  protected readonly links = [
    { label: 'Story', fragment: 'story' },
    { label: 'The show', fragment: 'format' },
    { label: 'Episodes', fragment: 'episodes' },
    { label: 'Hosts', fragment: 'hosts' },
  ];

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 960) this.ui.menuOpen.set(false);
  }
}
