/*
 * WILD CHILD — site content.
 * Episodes, products and settings live in src/content/*.json and are edited from the
 * admin (/admin, Sveltia CMS). Every edit is a Git commit: CI validates the content
 * (see content.spec.ts) before anything is deployed.
 * UI texts (FR / EN / ES / PT) live in src/app/i18n/.
 */
import episodesFile from '../../content/episodes.json';
import productsFile from '../../content/products.json';
import settingsFile from '../../content/settings.json';

export type ContentLang = 'fr' | 'en' | 'es' | 'pt';
export type Localized = Record<ContentLang, string>;

export const PRODUCT_TYPES = ['tee', 'hoodie', 'cap', 'mug', 'bottle', 'tote'] as const;
export const CATEGORIES = ['apparel', 'accessories', 'home'] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type Category = (typeof CATEGORIES)[number];

export interface Variant {
  size: string;
  /** Shopify variant ID (digits). Empty = demo mode. */
  shopifyId: string;
}

export interface Product {
  id: string;
  published: boolean;
  type: ProductType;
  category: Category;
  price: number;
  color: string;
  ink: string;
  print: string;
  /** Optional photo: uploaded in the admin (uploads/…) or imported from Shopify (cdn.shopify.com). Empty = SVG mockup. */
  image: string;
  name: Localized;
  badge: Localized;
  description: Localized;
  variants: Variant[];
  /** Demo product shipped with the site: hidden automatically once Shopify sync imports real products. */
  sample?: boolean;
  /** Imported from Shopify by the sync job. */
  synced?: boolean;
}

export interface Episode {
  n: number;
  published: boolean;
  /** YYYY-MM-DD */
  date: string;
  length: string;
  tags: string[];
  spotify: string;
  youtube: string;
  title: Localized;
  desc: Localized;
  /** RSS guid for episodes imported from the podcast feed, "sample" for demo episodes, "" for manual ones. */
  guid: string;
}

export interface Settings {
  /** false = pre-launch mode: teaser instead of episodes, shop in preview. */
  launched: boolean;
  podcast: { rssFeed: string };
  email: string;
  listen: Record<'spotify' | 'apple' | 'youtube' | 'deezer', string>;
  social: Record<'instagram' | 'tiktok' | 'youtube', string>;
  newsletterEndpoint: string;
  questionsEndpoint: string;
  shop: { domain: string; currency: string; freeShippingFrom: number; storefrontToken: string };
}

export interface SiteConfig extends Settings {
  brand: { name: string };
  products: Product[];
  episodes: Episode[];
}

/* ---------- Validation (used at runtime to sanitize, and by CI tests to reject bad content) ---------- */

export const HEX_COLOR = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;
export const SAFE_LINK = /^(#|https:\/\/[^\s"'<>]+)?$/;
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SHOPIFY_ID = /^\d*$/;
export const SHOPIFY_DOMAIN = /^([a-z0-9-]+\.myshopify\.com)?$/;
export const IMAGE_PATH = /^((\/?uploads\/[\w.-]+\.(jpe?g|png|webp|avif))|(https:\/\/cdn\.shopify\.com\/[^\s"'<>()]+))?$/i;
/** Storefront API tokens are public, read-only by design (32 hex chars). */
export const STOREFRONT_TOKEN = /^([0-9a-f]{32})?$/;
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const LANGS: ContentLang[] = ['fr', 'en', 'es', 'pt'];

const isLocalized = (l: unknown): l is Localized =>
  !!l && typeof l === 'object' && LANGS.every((k) => typeof (l as Record<string, unknown>)[k] === 'string');

/** Returns a list of problems; empty means the product is safe to render. */
export function productProblems(p: Product): string[] {
  const e: string[] = [];
  if (!SLUG.test(p.id)) e.push(`${p.id}: id must be lowercase-with-dashes`);
  if (!PRODUCT_TYPES.includes(p.type)) e.push(`${p.id}: unknown type ${p.type}`);
  if (!CATEGORIES.includes(p.category)) e.push(`${p.id}: unknown category ${p.category}`);
  if (!(typeof p.price === 'number' && p.price > 0 && p.price < 10000)) e.push(`${p.id}: invalid price`);
  if (!HEX_COLOR.test(p.color) || !HEX_COLOR.test(p.ink)) e.push(`${p.id}: colors must be #rrggbb`);
  if (typeof p.print !== 'string' || p.print.length > 24) e.push(`${p.id}: print text max 24 characters`);
  if (!IMAGE_PATH.test(p.image ?? '')) e.push(`${p.id}: image must be an uploaded jpg/png/webp or a Shopify image`);
  if (!isLocalized(p.name) || !isLocalized(p.badge) || !isLocalized(p.description)) e.push(`${p.id}: texts needed in fr/en/es/pt`);
  else if (!p.name.fr.trim()) e.push(`${p.id}: French name missing`);
  if (!Array.isArray(p.variants) || !p.variants.length) e.push(`${p.id}: at least one size`);
  else if (p.variants.some((v) => !v.size?.trim() || !SHOPIFY_ID.test(v.shopifyId ?? ''))) e.push(`${p.id}: invalid size or Shopify ID`);
  return e;
}

export function episodeProblems(ep: Episode): string[] {
  const e: string[] = [];
  const id = `episode ${ep.n}`;
  if (!Number.isInteger(ep.n) || ep.n < 0) e.push(`${id}: number must be a positive integer`);
  if (!ISO_DATE.test(ep.date) || Number.isNaN(Date.parse(ep.date))) e.push(`${id}: date must be YYYY-MM-DD`);
  if (!SAFE_LINK.test(ep.spotify ?? '') || !SAFE_LINK.test(ep.youtube ?? '')) e.push(`${id}: links must start with https://`);
  if (!isLocalized(ep.title) || !isLocalized(ep.desc)) e.push(`${id}: texts needed in fr/en/es/pt`);
  else if (!ep.title.fr.trim()) e.push(`${id}: French title missing`);
  if (typeof ep.guid !== 'string' || ep.guid.length > 300) e.push(`${id}: invalid guid`);
  if (!Array.isArray(ep.tags)) e.push(`${id}: tags must be a list`);
  return e;
}

export function settingsProblems(s: Settings): string[] {
  const e: string[] = [];
  const links = [...Object.values(s.listen), ...Object.values(s.social), s.newsletterEndpoint, s.questionsEndpoint, s.podcast?.rssFeed];
  if (typeof s.launched !== 'boolean') e.push('settings: launched must be true or false');
  if (!STOREFRONT_TOKEN.test(s.shop.storefrontToken ?? '')) e.push('settings: Storefront token must be 32 hex characters');
  if (links.some((l) => !SAFE_LINK.test(l ?? ''))) e.push('settings: links must start with https://');
  if (!/^[^\s@"<>]+@[^\s@"<>]+\.[^\s@"<>]+$/.test(s.email)) e.push('settings: invalid e-mail');
  if (!SHOPIFY_DOMAIN.test(s.shop.domain)) e.push('settings: Shopify domain must look like store.myshopify.com');
  if (!/^[A-Z]{3}$/.test(s.shop.currency)) e.push('settings: currency must be a 3-letter code (EUR)');
  if (!(s.shop.freeShippingFrom >= 0)) e.push('settings: invalid free-shipping threshold');
  return e;
}

/* ---------- Load ---------- */

const settings = settingsFile as Settings;
const allProducts = productsFile.products as Product[];
const allEpisodes = episodesFile.episodes as Episode[];

export const RAW_CONTENT = { settings, products: allProducts, episodes: allEpisodes };

// Defence in depth: anything invalid is dropped instead of rendered.
const safeSettings: Settings = settingsProblems(settings).length
  ? { ...settings, launched: false, podcast: { rssFeed: '' }, listen: { spotify: '#', apple: '#', youtube: '#', deezer: '#' }, social: { instagram: '#', tiktok: '#', youtube: '#' }, newsletterEndpoint: '', questionsEndpoint: '', shop: { ...settings.shop, domain: '', storefrontToken: '' } }
  : settings;

export const SITE: SiteConfig = {
  ...safeSettings,
  brand: { name: 'WILD CHILD' },
  products: allProducts.filter((p) => p.published && !productProblems(p).length),
  episodes: allEpisodes
    .filter((e) => e.published && !episodeProblems(e).length)
    .sort((a, b) => b.n - a.n),
};
