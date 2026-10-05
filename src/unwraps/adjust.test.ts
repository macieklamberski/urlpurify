import { describe, expect, it } from 'bun:test'
import { unwrapAdjust } from './adjust.js'

describe('unwrapAdjust', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://app.adjust.com/abc123?campaign=launch&redirect=https%3A%2F%2Fexample.com%2Fapp',
    )

    expect(unwrapAdjust(url)).toBe('https://example.com/app')
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL('https://app.adjust.com/abc123?campaign=launch')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for non-Adjust hosts', () => {
    const url = new URL('https://example.com/abc123?redirect=https%3A%2F%2Fother.com')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined when redirect is a custom-scheme URI', () => {
    const url = new URL('https://app.adjust.com/abc123?redirect=myapp%3A%2F%2Fopen')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path below the token', () => {
    const url = new URL(
      'https://app.adjust.com/abc123/extra?redirect=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const url = new URL('https://www.adjust.com/?redirect=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should extract target from a universal link fallback', () => {
    const url = new URL(
      'https://8xws.adj.st/?utm_source=news&utm_medium=in_article_banner&adj_t=1m4i69ak_1mazzg55&adj_fallback=https%3A%2F%2Fapp.weareblox.com%2F%3Fintent%3Dregister%26lan%3Dnl',
    )

    expect(unwrapAdjust(url)).toBe('https://app.weareblox.com/?intent=register&lan=nl')
  })

  it('should extract target from a universal link redirect on a deep-link path', () => {
    const url = new URL(
      'https://3kmh.adj.st/competition/13?seasonId=41850&view=fixtures&adj_t=1m32kzju_1mgyncle&adj_campaign=Podcast&adj_redirect=https%3A%2F%2Ftv.onefootball.com%2Fen%2Flive-matches',
    )

    expect(unwrapAdjust(url)).toBe('https://tv.onefootball.com/en/live-matches')
  })

  it('should extract target from a universal link macOS redirect', () => {
    const url = new URL(
      'https://vml8.adj.st/main?productId=515b205a&showcaseType=MINIMARKET&adj_t=zzwvyv8&adj_redirect_macos=https%3A%2F%2Fsamokat.ru%2F&adj_redirect_windows=https%3A%2F%2Fsamokat.ru%2F',
    )

    expect(unwrapAdjust(url)).toBe('https://samokat.ru/')
  })

  it('should extract target from a universal link older fallback', () => {
    const url = new URL(
      'https://a64p.adj.st/feed?incid=01_16436_2012&adjust_t=w4z9z2g_klpcai2&adjust_deeplink=pbmobilit://feed?incid=01_16436_2012&adjust_fallback=https://autobazar24.rs/',
    )

    expect(unwrapAdjust(url)).toBe('https://autobazar24.rs/')
  })

  it('should extract target from a universal link on the tr host', () => {
    const url = new URL(
      'https://meds.tr.adj.st/?adj_t=173p8vem&adj_fallback=https%3A%2F%2Fon.com.tr%2Fon-bilgilendirme%2F1411',
    )

    expect(unwrapAdjust(url)).toBe('https://on.com.tr/on-bilgilendirme/1411')
  })

  it('should prefer the universal link redirect over the fallback', () => {
    const url = new URL(
      'https://nquw.adj.st/special?adj_t=2bpsx8m&adj_fallback=https%3A%2F%2Fexample.com%2Ffallback&adj_redirect=https%3A%2F%2Fexample.com%2Fredirect',
    )

    expect(unwrapAdjust(url)).toBe('https://example.com/redirect')
  })

  it('should return undefined for a universal link with only a deep link', () => {
    const url = new URL(
      'https://v5um.adj.st/?adj_t=10iqlug2&adj_deep_link=franceinfo%3A%2F%2Ftitles',
    )

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the universal link host', () => {
    const url = new URL('https://x8xws.adj.st/?adj_fallback=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the universal link host', () => {
    const url = new URL(
      'https://8xws.adj.st.example.com/?adj_fallback=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAdjust(url)).toBeUndefined()
  })
})
