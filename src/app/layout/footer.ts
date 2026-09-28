import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/site.config';
import { I18nService } from '../i18n/i18n.service';
import { LangSwitch } from './lang-switch';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LangSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" routerLink="/"><img src="logo.svg" alt="" width="36" height="36" /><span style="color: var(--cream)">{{ site.brand.name }}</span></a>
            <p style="margin-top: 12px">{{ t.show }}.<br />{{ t.tagline }}</p>
            <app-lang-switch style="display: block; margin-top: 16px" />
          </div>
          <div>
            <h4>{{ t.footer.listen }}</h4>
            <ul>
              <li><a [href]="site.listen.spotify" target="_blank" rel="noopener">Spotify</a></li>
              <li><a [href]="site.listen.apple" target="_blank" rel="noopener">Apple Podcasts</a></li>
              <li><a [href]="site.listen.youtube" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
          <div>
            <h4>{{ t.footer.follow }}</h4>
            <ul>
              <li><a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a></li>
              <li><a [href]="site.social.tiktok" target="_blank" rel="noopener">TikTok</a></li>
              <li><a [href]="site.social.youtube" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
          <div>
            <h4>{{ t.footer.more }}</h4>
            <ul>
              <li><a routerLink="/shop">{{ t.nav.shop }}</a></li>
              <li><a routerLink="/" fragment="newsletter">{{ t.footer.newsletter }}</a></li>
              <li><a [href]="'mailto:' + site.brand.email">{{ site.brand.email }}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© {{ year }} {{ t.footer.rights }}</span>
          <span>{{ t.footer.madeOn }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly i18n = inject(I18nService);
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
}
