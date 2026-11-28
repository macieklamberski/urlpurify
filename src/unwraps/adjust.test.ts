import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapAdjust } from './adjust.js'

describe('unwrapAdjust', () => {
  it('should extract target from redirect param', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?campaign=launch&redirect=https%3A%2F%2Fexample.com%2Fapp',
    )
    const expected = 'https://example.com/app'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?campaign=launch&redirect=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?campaign=launch&redirect=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should return undefined when redirect param is missing', () => {
    const value = new URL('https://app.adjust.com/abc123?campaign=launch')

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined for non-Adjust hosts', () => {
    const value = new URL('https://example.com/abc123?redirect=https%3A%2F%2Fother.com')

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined when redirect is a custom-scheme URI', () => {
    const value = new URL('https://app.adjust.com/abc123?redirect=myapp%3A%2F%2Fopen')

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path below the token', () => {
    const value = new URL(
      'https://app.adjust.com/abc123/extra?redirect=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const value = new URL('https://www.adjust.com/?redirect=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should extract target from the tracker fallback', () => {
    const value = new URL(
      'https://app.adjust.com/1vsbb5d1?adgroup=Influencer_piepsein_lovinn+launch&fallback=https%3A%2F%2Fwww.example.com%2F&redirect_macos=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should return undefined for a tracker with only a macOS redirect', () => {
    const value = new URL(
      'https://app.adjust.com/vkqj7re?campaign=podcast&adgroup=broker&redirect_ios=https%3A%2F%2Fexample.org%2Fapp%2Fid1&redirect_macos=https%3A%2F%2Fexample.com%2Ftrading%2F',
    )

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should prefer the tracker Windows redirect over the redirect', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?redirect=https%3A%2F%2Fexample.com%2Fredirect&redirect_windows=https%3A%2F%2Fexample.com%2Fwindows',
    )
    const expected = 'https://example.com/windows'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should prefer the tracker redirect over the fallback', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?fallback=https%3A%2F%2Fexample.com%2Ffallback&redirect=https%3A%2F%2Fexample.com%2Fredirect',
    )
    const expected = 'https://example.com/redirect'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should skip a custom-scheme redirect for the tracker fallback', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?redirect=myapp%3A%2F%2Fopen&fallback=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should return a tracker redirect without a scheme over the fallback', () => {
    const value = new URL(
      'https://app.adjust.com/abc123?redirect=www.example.com%2Fpost&fallback=https%3A%2F%2Fexample.com%2Fapp',
    )
    const expected = 'www.example.com/post'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should skip a custom-scheme universal link redirect for the fallback', () => {
    const value = new URL(
      'https://abcd.adj.st/open?adj_redirect=myapp://open&adj_fallback=https://example.com/app',
    )
    const expected = 'https://example.com/app'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract target from a universal link fallback', () => {
    const value = new URL(
      'https://8xws.adj.st/?utm_source=news&utm_medium=in_article_banner&adj_t=1m4i69ak_1mazzg55&adj_fallback=https%3A%2F%2Fexample.com%2F%3Fintent%3Dregister%26lan%3Dnl',
    )
    const expected = 'https://example.com/?intent=register&lan=nl'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract target from a universal link redirect on a deep-link path', () => {
    const value = new URL(
      'https://3kmh.adj.st/competition/13?seasonId=41850&view=fixtures&adj_t=1m32kzju_1mgyncle&adj_campaign=Podcast&adj_redirect=https%3A%2F%2Fexample.com%2Fen%2Flive-matches',
    )
    const expected = 'https://example.com/en/live-matches'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract target from a universal link Windows redirect', () => {
    const value = new URL(
      'https://vml8.adj.st/main?productId=515b205a&showcaseType=MINIMARKET&adj_t=zzwvyv8&adj_redirect_macos=https%3A%2F%2Fexample.com%2F&adj_redirect_windows=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract target from a universal link older fallback', () => {
    const value = new URL(
      'https://a64p.adj.st/feed?incid=01_16436_2012&adjust_t=w4z9z2g_klpcai2&adjust_deeplink=pbmobilit://feed?incid=01_16436_2012&adjust_fallback=https://example.com/',
    )
    const expected = 'https://example.com/'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should extract target from a universal link on the tr host', () => {
    const value = new URL(
      'https://meds.tr.adj.st/?adj_t=173p8vem&adj_fallback=https%3A%2F%2Fexample.com%2Fon-bilgilendirme%2F1411',
    )
    const expected = 'https://example.com/on-bilgilendirme/1411'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should return undefined for a universal link with only a macOS redirect', () => {
    const value = new URL(
      'https://vml8.adj.st/main?adj_t=zzwvyv8&adj_redirect_macos=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should prefer the universal link Windows redirect over the redirect', () => {
    const value = new URL(
      'https://vml8.adj.st/main?adj_t=zzwvyv8&adj_redirect=https%3A%2F%2Fexample.com%2Fredirect&adj_redirect_windows=https%3A%2F%2Fexample.com%2Fwindows',
    )
    const expected = 'https://example.com/windows'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should prefer the universal link older fallback over the fallback', () => {
    const value = new URL(
      'https://vml8.adj.st/main?adj_t=zzwvyv8&adj_fallback=https%3A%2F%2Fexample.com%2Ffallback&adjust_fallback=https%3A%2F%2Fexample.com%2Folder',
    )
    const expected = 'https://example.com/older'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should prefer the universal link redirect over the fallback', () => {
    const value = new URL(
      'https://nquw.adj.st/special?adj_t=2bpsx8m&adj_fallback=https%3A%2F%2Fexample.com%2Ffallback&adj_redirect=https%3A%2F%2Fexample.com%2Fredirect',
    )
    const expected = 'https://example.com/redirect'

    expect(unwrapAdjust(value)).toBe(expected)
  })

  it('should return undefined for a universal link with only a deep link', () => {
    const value = new URL(
      'https://v5um.adj.st/?adj_t=10iqlug2&adj_deep_link=franceinfo%3A%2F%2Ftitles',
    )

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the universal link host', () => {
    const value = new URL('https://x8xws.adj.st/?adj_fallback=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the universal link host', () => {
    const value = new URL(
      'https://8xws.adj.st.example.com/?adj_fallback=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAdjust(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapAdjust)).toBe(true)
  })
})
