/*
 * Imports new podcast episodes (RSS) and merch (Shopify Storefront API) into src/content/*.json.
 * Run by GitHub Actions every hour (see .github/workflows/pages.yml). Needs Node >= 22.18 (type stripping).
 * Does nothing until the RSS feed / Shopify store are filled in the admin (Réglages).
 * Network problems never break the site: existing content is kept.
 */
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import { syncEpisodes, syncProducts, type RssItem, type ShopifyProduct } from '../src/app/core/sync.ts';

const SHOPIFY_API_VERSION = '2025-07';
const MAX_BYTES = 5_000_000;
const dir = new URL('../src/content/', import.meta.url);
const read = (f: string) => JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
const write = (f: string, data: unknown) => writeFileSync(new URL(f, dir), JSON.stringify(data, null, 2) + '\n');

async function fetchText(url: string, init: RequestInit = {}): Promise<string> {
  const res = await fetch(url, { ...init, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const text = await res.text();
  if (text.length > MAX_BYTES) throw new Error(`${url} → response too large`);
  return text;
}

const text = (v: unknown): string =>
  v == null ? '' : typeof v === 'object' ? String((v as Record<string, unknown>)['#text'] ?? '') : String(v);

async function readFeed(url: string): Promise<RssItem[]> {
  const xml = await fetchText(url);
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', processEntities: true }).parse(xml);
  const raw = doc?.rss?.channel?.item ?? [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items.map((i: Record<string, unknown>) => ({
    guid: text(i['guid']) || text(i['link']),
    title: text(i['title']),
    description: text(i['description']) || text(i['itunes:summary']) || text(i['content:encoded']),
    pubDate: text(i['pubDate']),
    duration: text(i['itunes:duration']),
    episode: text(i['itunes:episode']),
    link: text(i['link']),
  }));
}

async function readShop(domain: string, token: string): Promise<ShopifyProduct[]> {
  const query = `{ products(first: 100, sortKey: CREATED_AT) { nodes {
    handle title description productType featuredImage { url }
    variants(first: 50) { nodes { id title price { amount } } } } } }`;
  const body = await fetchText(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query }),
  });
  const json = JSON.parse(body);
  if (json.errors) throw new Error(`Shopify: ${JSON.stringify(json.errors).slice(0, 300)}`);
  return json.data?.products?.nodes ?? [];
}

const settings = read('settings.json');
let changed = false;

if (settings.podcast?.rssFeed?.startsWith('https://')) {
  try {
    const file = read('episodes.json');
    const next = syncEpisodes(file.episodes, await readFeed(settings.podcast.rssFeed));
    if (JSON.stringify(next) !== JSON.stringify(file.episodes)) {
      write('episodes.json', { episodes: next });
      changed = true;
      console.log(`Episodes updated from RSS (${next.filter((e) => e.published).length} published).`);
    } else console.log('Episodes: nothing new.');
  } catch (err) {
    console.warn(`::warning::RSS sync skipped: ${(err as Error).message}`);
  }
} else console.log('RSS feed not set yet: episodes stay manual.');

const { domain, storefrontToken } = settings.shop ?? {};
if (/^[a-z0-9-]+\.myshopify\.com$/.test(domain ?? '') && /^[0-9a-f]{32}$/.test(storefrontToken ?? '')) {
  try {
    const file = read('products.json');
    const next = syncProducts(file.products, await readShop(domain, storefrontToken));
    if (JSON.stringify(next) !== JSON.stringify(file.products)) {
      write('products.json', { products: next });
      changed = true;
      console.log(`Products updated from Shopify (${next.filter((p) => p.published).length} on sale).`);
    } else console.log('Products: nothing new.');
  } catch (err) {
    console.warn(`::warning::Shopify sync skipped: ${(err as Error).message}`);
  }
} else console.log('Shopify store not connected yet: products stay manual.');

if (process.env['GITHUB_OUTPUT']) appendFileSync(process.env['GITHUB_OUTPUT'], `changed=${changed}\n`);
