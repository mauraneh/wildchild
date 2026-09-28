import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lang-switch" role="group" [attr.aria-label]="i18n.t().nav.language">
      @for (l of i18n.langs; track l.code) {
        <button type="button" [attr.lang]="l.code" [attr.aria-pressed]="i18n.lang() === l.code" [attr.aria-label]="l.name" (click)="i18n.setLang(l.code)">
          {{ l.code.toUpperCase() }}
        </button>
      }
    </div>
  `,
})
export class LangSwitch {
  protected readonly i18n = inject(I18nService);
}
