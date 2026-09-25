import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/site.config';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" routerLink="/"><img src="logo.svg" alt="" width="36" height="36" /><span style="color: var(--cream)">{{ site.brand.name }}</span></a>
            <p style="margin-top: 12px">{{ site.brand.show }}.<br />{{ site.brand.tagline }}</p>
          </div>
          <div>
            <h4>Listen</h4>
            <ul>
              <li><a [href]="site.listen.spotify" target="_blank" rel="noopener">Spotify</a></li>
              <li><a [href]="site.listen.apple" target="_blank" rel="noopener">Apple Podcasts</a></li>
              <li><a [href]="site.listen.youtube" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li><a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a></li>
              <li><a [href]="site.social.tiktok" target="_blank" rel="noopener">TikTok</a></li>
              <li><a [href]="site.social.youtube" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>
              <li><a routerLink="/shop">Shop</a></li>
              <li><a routerLink="/" fragment="newsletter">Newsletter</a></li>
              <li><a [href]="'mailto:' + site.brand.email">{{ site.brand.email }}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© {{ year }} Wild Child. Drink responsibly — hydrate irresponsibly.</span>
          <span>Made on a Sunday ☀️</span>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
}
