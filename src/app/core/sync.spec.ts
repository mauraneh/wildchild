import { Episode, Product, RAW_CONTENT, episodeProblems, productProblems } from './site.config';
import { RssItem, ShopifyProduct, formatDuration, guessKind, syncEpisodes, syncProducts, toPlainText } from './sync';

const item = (over: Partial<RssItem> = {}): RssItem => ({
  guid: 'g1', title: 'Épisode 1', description: '<p>Hello <b>you</b></p>', pubDate: 'Sun, 04 Oct 2026 09:00:00 GMT',
  duration: '2820', episode: '1', link: 'https://example.com/ep1', ...over,
});

const shopProduct = (over: Partial<ShopifyProduct> = {}): ShopifyProduct => ({
  handle: 'wild-hoodie', title: 'Wild Hoodie', description: 'Soft', productType: 'Hoodie',
  featuredImage: { url: 'https://cdn.shopify.com/s/files/1/hoodie.jpg' },
  variants: { nodes: [{ id: 'gid://shopify/ProductVariant/111', title: 'M', price: { amount: '55.00' } }] }, ...over,
});

describe('RSS sync', () => {
  it('cleans text and formats durations', () => {
    expect(toPlainText('<p>A &amp; B</p><script>alert(1)</script><img src=x onerror=y>')).toBe('A & B');
    expect(formatDuration('2820')).toBe('47 min');
    expect(formatDuration('01:02:00')).toBe('62 min');
    expect(formatDuration('nope')).toBe('');
  });

  it('imports feed episodes, removes demo ones, and output passes validation', () => {
    const out = syncEpisodes(RAW_CONTENT.episodes, [item(), item({ guid: 'g2', episode: '2', pubDate: 'Sun, 11 Oct 2026 09:00:00 GMT' })]);
    expect(out.map((e) => e.guid)).toEqual(['g2', 'g1']);
    expect(out[1]).toMatchObject({ n: 1, date: '2026-10-04', length: '47 min', spotify: 'https://example.com/ep1' });
    expect(out[1].desc.fr).toBe('Hello you');
    expect(out.flatMap(episodeProblems)).toEqual([]);
  });

  it('keeps translations and links edited in the admin', () => {
    const edited: Episode = { ...syncEpisodes([], [item()])[0], title: { fr: 'Mon titre', en: 'My title', es: '', pt: '' }, youtube: 'https://youtu.be/x', published: false };
    const out = syncEpisodes([edited], [item({ title: 'Titre du flux' })]);
    expect(out[0]).toMatchObject({ title: { fr: 'Mon titre', en: 'My title' }, youtube: 'https://youtu.be/x', published: false });
  });

  it('drops unsafe links and ignores an empty feed', () => {
    expect(syncEpisodes([], [item({ link: 'javascript:alert(1)' })])[0].spotify).toBe('');
    expect(syncEpisodes(RAW_CONTENT.episodes, [])).toBe(RAW_CONTENT.episodes);
  });
});

describe('Shopify sync', () => {
  it('imports products, hides demo ones, and output passes validation', () => {
    const out = syncProducts(RAW_CONTENT.products, [shopProduct()]);
    const hoodie = out.find((p) => p.id === 'wild-hoodie')!;
    expect(hoodie).toMatchObject({ published: true, price: 55, type: 'hoodie', category: 'apparel', synced: true, variants: [{ size: 'M', shopifyId: '111' }] });
    expect(out.filter((p) => p.published).length).toBe(1);
    expect(out.flatMap(productProblems)).toEqual([]);
  });

  it('keeps admin edits and refuses non-Shopify images', () => {
    const first = syncProducts([], [shopProduct()])[0];
    const edited: Product = { ...first, name: { fr: 'Le sweat', en: 'The hoodie', es: '', pt: '' }, badge: { fr: 'Nouveau', en: 'New', es: '', pt: '' } };
    const out = syncProducts([edited], [shopProduct({ featuredImage: { url: 'https://evil.example/x.jpg' }, variants: { nodes: [{ id: 'gid://shopify/ProductVariant/222', title: 'Default Title', price: { amount: '49' } }] } })]);
    expect(out[0]).toMatchObject({ name: { fr: 'Le sweat', en: 'The hoodie' }, badge: { fr: 'Nouveau' }, price: 49, variants: [{ size: 'One size', shopifyId: '222' }] });
    expect(syncProducts([], [shopProduct({ featuredImage: { url: 'https://evil.example/x.jpg' } })])[0].image).toBe('');
  });

  it('hides products removed from Shopify', () => {
    const first = syncProducts([], [shopProduct()]);
    const out = syncProducts(first, [shopProduct({ handle: 'other-tee', title: 'Other Tee', productType: 'T-shirt' })]);
    expect(out.find((p) => p.id === 'wild-hoodie')?.published).toBe(false);
    expect(guessKind('Mug Monday')).toEqual({ type: 'mug', category: 'home' });
  });
});
