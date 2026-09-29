/*
 * Content sync: turns the podcast RSS feed and the Shopify catalogue into src/content/*.json.
 * Pure functions (no I/O) so they can be unit-tested; scripts/sync-content.ts does the fetching.
 * Rules:
 *  - Texts edited in the admin (translations, badges, tags, YouTube links…) are never overwritten.
 *  - Demo episodes (guid "sample") are removed and demo products (sample: true) hidden once real ones exist.
 *  - Output is still validated by content.spec.ts in CI before anything is deployed.
 */
import type { Category, Episode, Localized, Product, ProductType, Variant } from './site.config';

export interface RssItem {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  episode: string;
  link: string;
}

export interface ShopifyProduct {
  handle: string;
  title: string;
  description: string;
  productType: string;
  featuredImage: { url: string } | null;
  variants: { nodes: { id: string; title: string; price: { amount: string } }[] };
}

const MAX_DESC = 400;
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

/** Plain text only: tags removed, entities decoded, whitespace collapsed, length capped. */
export function toPlainText(html: string, max = MAX_DESC): string {
  const text = String(html ?? '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<\s*(br|\/p|\/li)\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e: string) => {
      if (e[0] === '#') {
        const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : '';
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function toIsoDate(date: string): string {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

/** itunes:duration is "2820" (seconds), "47:00" or "0:47:00" → "47 min". */
export function formatDuration(raw: string): string {
  const parts = String(raw ?? '').trim().split(':').map((n) => parseInt(n, 10));
  if (!parts.length || parts.some((n) => Number.isNaN(n))) return '';
  const seconds = parts.reduce((acc, n) => acc * 60 + n, 0);
  const minutes = Math.round(seconds / 60);
  return minutes > 0 ? `${minutes} min` : '';
}

const frOnly = (fr: string): Localized => ({ fr, en: '', es: '', pt: '' });
const safeHttps = (url: string): string => (/^https:\/\/[^\s"'<>]+$/.test(url ?? '') ? url : '');

export function syncEpisodes(existing: Episode[], items: RssItem[]): Episode[] {
  const valid = items.filter((i) => i.guid && i.title && toIsoDate(i.pubDate));
  if (!valid.length) return existing;

  const byGuid = new Map(existing.filter((e) => e.guid && e.guid !== 'sample').map((e) => [e.guid, e]));
  const feedGuids = new Set(valid.map((i) => i.guid));
  const sorted = [...valid].sort((a, b) => toIsoDate(a.pubDate).localeCompare(toIsoDate(b.pubDate)));

  const fromFeed: Episode[] = sorted.map((item, index) => {
    const prev = byGuid.get(item.guid);
    const n = parseInt(item.episode, 10);
    const title = toPlainText(item.title, 120);
    const desc = toPlainText(item.description);
    return {
      n: Number.isInteger(n) && n >= 0 ? n : (prev?.n ?? index + 1),
      published: prev?.published ?? true,
      date: toIsoDate(item.pubDate),
      length: formatDuration(item.duration) || prev?.length || '',
      tags: prev?.tags ?? [],
      spotify: prev?.spotify || safeHttps(item.link),
      youtube: prev?.youtube ?? '',
      title: prev ? { ...prev.title, fr: prev.title.fr || title } : frOnly(title),
      desc: prev ? { ...prev.desc, fr: prev.desc.fr || desc } : frOnly(desc),
      guid: item.guid,
    };
  });

  // Demo episodes are dropped once the real feed exists (their numbers would clash).
  const others = existing.filter((e) => !feedGuids.has(e.guid) && e.guid !== 'sample');

  return [...fromFeed.reverse(), ...others];
}

const GUESS: [RegExp, ProductType, Category][] = [
  [/hoodie|sweat|crewneck|pull/i, 'hoodie', 'apparel'],
  [/t-?shirt|tee|shirt|débardeur|tank/i, 'tee', 'apparel'],
  [/cap|casquette|hat|bonnet|beanie/i, 'cap', 'accessories'],
  [/mug|tasse|cup/i, 'mug', 'home'],
  [/bottle|gourde|tumbler/i, 'bottle', 'accessories'],
  [/tote|bag|sac/i, 'tote', 'accessories'],
];

export function guessKind(text: string): { type: ProductType; category: Category } {
  const hit = GUESS.find(([re]) => re.test(text));
  return hit ? { type: hit[1], category: hit[2] } : { type: 'tee', category: 'apparel' };
}

export const slugify = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'product';

export function syncProducts(existing: Product[], shop: ShopifyProduct[]): Product[] {
  const valid = shop.filter((p) => p.handle && p.title && p.variants?.nodes?.length);
  if (!valid.length) return existing;

  const byId = new Map(existing.map((p) => [p.id, p]));
  const shopIds = new Set<string>();

  const fromShop: Product[] = valid.map((sp) => {
    const id = slugify(sp.handle);
    shopIds.add(id);
    const prev = byId.get(id);
    const kind = guessKind(`${sp.productType} ${sp.title}`);
    const variants: Variant[] = sp.variants.nodes.map((v) => ({
      size: v.title === 'Default Title' ? 'One size' : toPlainText(v.title, 40),
      shopifyId: (v.id.match(/(\d+)$/) ?? ['', ''])[1],
    }));
    const prices = sp.variants.nodes.map((v) => parseFloat(v.price.amount)).filter((n) => n > 0);
    const image = /^https:\/\/cdn\.shopify\.com\/[^\s"'<>()]+$/i.test(sp.featuredImage?.url ?? '') ? sp.featuredImage!.url : '';
    const title = toPlainText(sp.title, 80);
    const desc = toPlainText(sp.description, 300);
    return {
      id,
      published: prev?.published ?? true,
      type: prev?.type ?? kind.type,
      category: prev?.category ?? kind.category,
      price: prices.length ? Math.min(...prices) : (prev?.price ?? 1),
      color: prev?.color ?? '#fff8ee',
      ink: prev?.ink ?? '#0f0e17',
      print: prev?.print ?? title.toUpperCase().slice(0, 24),
      image: prev?.image && !prev.image.startsWith('https://') ? prev.image : image,
      name: prev ? { ...prev.name, fr: prev.name.fr || title } : frOnly(title),
      badge: prev?.badge ?? frOnly(''),
      description: prev ? { ...prev.description, fr: prev.description.fr || desc } : frOnly(desc),
      variants,
      sample: false,
      synced: true,
    };
  });

  const others = existing
    .filter((p) => !shopIds.has(p.id))
    // Demo products, and products removed from Shopify, are hidden (kept in the file for history).
    .map((p) => (p.sample || p.synced ? { ...p, published: false } : p));

  return [...fromShop, ...others];
}
