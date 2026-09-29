import { SITE, RAW_CONTENT, episodeProblems, productProblems, settingsProblems, Product, Episode } from './site.config';
import { mockupSvg } from '../shared/mockup';

/**
 * These tests run in CI before every deploy. Content edited in the admin that is invalid
 * or unsafe (bad colors, javascript: links, duplicate ids…) fails the build and never goes live.
 */
describe('Admin content (src/content/*.json)', () => {
  it('settings are valid', () => {
    expect(settingsProblems(RAW_CONTENT.settings)).toEqual([]);
  });

  it('every product is valid', () => {
    expect(RAW_CONTENT.products.flatMap(productProblems)).toEqual([]);
  });

  it('every episode is valid', () => {
    expect(RAW_CONTENT.episodes.flatMap(episodeProblems)).toEqual([]);
  });

  it('product ids and episode numbers are unique', () => {
    const ids = RAW_CONTENT.products.map((p) => p.id);
    const nums = RAW_CONTENT.episodes.map((e) => e.n);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it('the site has something to show', () => {
    expect(SITE.products.length).toBeGreaterThan(0);
    expect(SITE.episodes.length).toBeGreaterThan(0);
  });
});

describe('Content validation catches attacks', () => {
  const base = RAW_CONTENT.products[0];
  const ep = RAW_CONTENT.episodes[0];

  it('rejects script injection through colors', () => {
    const evil: Product = { ...base, color: '#fff" onload="alert(1)' };
    expect(productProblems(evil).length).toBeGreaterThan(0);
    expect(mockupSvg(evil)).not.toContain('onload');
  });

  it('escapes print text in the SVG mockup', () => {
    const svg = mockupSvg({ ...base, print: '<script>x</script>' });
    expect(svg).not.toContain('<script>');
  });

  it('rejects javascript: and http: links', () => {
    expect(episodeProblems({ ...ep, youtube: 'javascript:alert(1)' } as Episode).length).toBeGreaterThan(0);
    expect(episodeProblems({ ...ep, spotify: 'http://evil.example' } as Episode).length).toBeGreaterThan(0);
    expect(episodeProblems({ ...ep, youtube: 'https://youtu.be/abc' } as Episode)).toEqual([]);
  });

  it('rejects a checkout domain that is not a Shopify store', () => {
    expect(settingsProblems({ ...RAW_CONTENT.settings, shop: { ...RAW_CONTENT.settings.shop, domain: 'evil.example/phish' } }).length).toBeGreaterThan(0);
  });

  it('rejects non-numeric Shopify variant IDs and external images', () => {
    expect(productProblems({ ...base, variants: [{ size: 'M', shopifyId: '12/../x' }] }).length).toBeGreaterThan(0);
    expect(productProblems({ ...base, image: 'https://evil.example/x.png' }).length).toBeGreaterThan(0);
  });
});
