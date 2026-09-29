import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SITE } from '../../core/site.config';
import { I18nService } from '../../i18n/i18n.service';

export const TOPICS = ['sport', 'dating', 'hangover', 'balance', 'other'] as const;
export type Topic = (typeof TOPICS)[number];

type Status = 'idle' | 'sending' | 'sent' | 'mail' | 'error';
type Problem = 'tooShort' | 'needConsent' | 'invalidEmail' | null;

const MIN_LENGTH = 15;
export const MAX_LENGTH = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "Pose ta question" — listeners send a question that can be read on air.
 * Sends to SITE.questionsEndpoint (e.g. Formspree) when set, otherwise opens a pre-filled e-mail.
 */
@Component({
  selector: 'app-ask-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ask-question.html',
})
export class AskQuestion {
  protected readonly i18n = inject(I18nService);
  protected readonly topics = TOPICS;
  protected readonly maxLength = MAX_LENGTH;
  protected readonly email = SITE.email;

  protected readonly name = signal('');
  protected readonly topic = signal<Topic>('dating');
  protected readonly question = signal('');
  protected readonly contact = signal('');
  protected readonly anonymous = signal(false);
  protected readonly consent = signal(false);
  protected readonly honeypot = signal('');

  protected readonly status = signal<Status>('idle');
  protected readonly problem = signal<Problem>(null);
  protected readonly length = computed(() => this.question().trim().length);

  protected value(ev: Event): string {
    return (ev.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  protected checked(ev: Event): boolean {
    return (ev.target as HTMLInputElement).checked;
  }

  protected async submit(ev: Event): Promise<void> {
    ev.preventDefault();
    if (this.status() === 'sending') return;

    const problem = this.validate();
    this.problem.set(problem);
    if (problem) return;

    // Bots fill the hidden field; pretend it worked.
    if (this.honeypot()) {
      this.status.set('sent');
      return;
    }

    const t = this.i18n.t().home.ask;
    const payload = {
      name: this.name().trim() || '-',
      topic: t.topics[this.topic()],
      question: this.question().trim(),
      email: this.contact().trim() || '-',
      anonymous: this.anonymous() ? 'yes' : 'no',
      language: this.i18n.lang(),
      _subject: `${t.mailSubject} · ${t.topics[this.topic()]}`,
    };

    if (!SITE.questionsEndpoint) {
      this.openMail(payload);
      return;
    }

    this.status.set('sending');
    try {
      const res = await fetch(SITE.questionsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      this.status.set(res.ok ? 'sent' : 'error');
    } catch {
      this.status.set('error');
    }
  }

  protected reset(): void {
    this.question.set('');
    this.problem.set(null);
    this.status.set('idle');
  }

  protected mailtoHref(): string {
    const t = this.i18n.t().home.ask;
    return `mailto:${this.email}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(this.question())}`;
  }

  private validate(): Problem {
    if (this.length() < MIN_LENGTH) return 'tooShort';
    const contact = this.contact().trim();
    if (contact && !EMAIL_RE.test(contact)) return 'invalidEmail';
    if (!this.consent()) return 'needConsent';
    return null;
  }

  private openMail(p: { name: string; topic: string; question: string; email: string; anonymous: string; language: string; _subject: string }): void {
    const t = this.i18n.t().home.ask;
    const body = [
      p.question,
      '',
      '---',
      `${t.topicLabel}: ${p.topic}`,
      `${t.nameLabel}: ${p.name}`,
      `${t.anonymous}: ${p.anonymous}`,
    ].join('\n');
    window.location.href = `mailto:${this.email}?subject=${encodeURIComponent(p._subject)}&body=${encodeURIComponent(body)}`;
    this.status.set('mail');
  }
}
