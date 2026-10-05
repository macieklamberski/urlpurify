import { describe, expect, it } from 'bun:test'
import { unwrapPartnerAds } from './partnerAds.js'

describe('unwrapPartnerAds', () => {
  it('should extract target from htmlurl param', () => {
    const url = new URL('https://www.partner-ads.com/?htmlurl=https%3A%2F%2Fexample.com%2Fdeal')

    expect(unwrapPartnerAds(url)).toBe('https://example.com/deal')
  })

  it('should return undefined when htmlurl param is missing', () => {
    const url = new URL('https://www.partner-ads.com/?other=value')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should return undefined for non-partner-ads hosts', () => {
    const url = new URL('https://example.com/?htmlurl=https%3A%2F%2Fother.com')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should extract target from the click banner path', () => {
    const url = new URL(
      'https://www.partner-ads.com/dk/klikbanner.php?partnerid=19716&bannerid=22011&htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(url)).toBe('https://example.com/post')
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(
      'https://dk.partner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(url)).toBe('https://example.com/post')
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL(
      'https://examplepartner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.partner-ads.com/dk/other.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should extract target from a deep link path', () => {
    const url = new URL(
      'https://www.partner-ads.com/dk/c/p/51339/b/38484/https://www.example.com/gronne-mini-bolde-2-stk',
    )

    expect(unwrapPartnerAds(url)).toBe('https://www.example.com/gronne-mini-bolde-2-stk')
  })

  it('should keep the query and fragment of a deep link target', () => {
    const url = new URL(
      'https://www.partner-ads.com/dk/c/p/15999/b/17685/https://www.example.com/search?q=chili#top',
    )

    expect(unwrapPartnerAds(url)).toBe('https://www.example.com/search?q=chili#top')
  })

  it('should extract target from a deep link with sub ids', () => {
    const url = new URL(
      'https://www.partner-ads.com/dk/c/p/41996/b/68419/u1/zink/u2/ramme/https://www.example.com/zinc-tablets.html',
    )

    expect(unwrapPartnerAds(url)).toBe('https://www.example.com/zinc-tablets.html')
  })

  it('should return undefined for a deep link without a target', () => {
    const url = new URL('https://www.partner-ads.com/dk/c/p/51339/b/38484/')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should return undefined for a deep link with sub ids and no target', () => {
    const url = new URL('https://www.partner-ads.com/dk/c/p/51339/b/38484/u1/zink/')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should return undefined for a deep link with a non-numeric partner id', () => {
    const url = new URL('https://www.partner-ads.com/dk/c/p/abc/b/38484/https://www.example.com/')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })

  it('should return undefined for the deep link shape on another host', () => {
    const url = new URL('https://example.com/dk/c/p/51339/b/38484/https://www.example.org/post')

    expect(unwrapPartnerAds(url)).toBeUndefined()
  })
})
