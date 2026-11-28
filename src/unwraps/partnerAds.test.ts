import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapPartnerAds } from './partnerAds.js'

describe('unwrapPartnerAds', () => {
  it('should extract target from htmlurl param', () => {
    const value = new URL('https://www.partner-ads.com/?htmlurl=https%3A%2F%2Fexample.com%2Fdeal')
    const expected = 'https://example.com/deal'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should return undefined when htmlurl param is missing', () => {
    const value = new URL('https://www.partner-ads.com/?other=value')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should return undefined for non-partner-ads hosts', () => {
    const value = new URL('https://example.com/?htmlurl=https%3A%2F%2Fother.com')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should extract target from the click banner path', () => {
    const value = new URL(
      'https://www.partner-ads.com/dk/klikbanner.php?partnerid=19716&bannerid=22011&htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should extract target on the apex domain', () => {
    const value = new URL(
      'https://partner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const value = new URL(
      'https://dk.partner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL(
      'https://examplepartner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.partner-ads.com/dk/other.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should extract target from a deep link path', () => {
    const value = new URL(
      'https://www.partner-ads.com/dk/c/p/51339/b/38484/https://www.example.com/gronne-mini-bolde-2-stk',
    )
    const expected = 'https://www.example.com/gronne-mini-bolde-2-stk'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should keep the query and fragment of a deep link target', () => {
    const value = new URL(
      'https://www.partner-ads.com/dk/c/p/15999/b/17685/https://www.example.com/search?q=chili#top',
    )
    const expected = 'https://www.example.com/search?q=chili#top'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should extract target from a deep link with sub ids', () => {
    const value = new URL(
      'https://www.partner-ads.com/dk/c/p/41996/b/68419/u1/zink/u2/ramme/https://www.example.com/zinc-tablets.html',
    )
    const expected = 'https://www.example.com/zinc-tablets.html'

    expect(unwrapPartnerAds(value)).toBe(expected)
  })

  it('should return undefined for a deep link without a target', () => {
    const value = new URL('https://www.partner-ads.com/dk/c/p/51339/b/38484/')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should return undefined for a deep link with sub ids and no target', () => {
    const value = new URL('https://www.partner-ads.com/dk/c/p/51339/b/38484/u1/zink/')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should return undefined for a deep link with a non-numeric partner id', () => {
    const value = new URL('https://www.partner-ads.com/dk/c/p/abc/b/38484/https://www.example.com/')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should return undefined for the deep link shape on another host', () => {
    const value = new URL('https://example.com/dk/c/p/51339/b/38484/https://www.example.org/post')

    expect(unwrapPartnerAds(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapPartnerAds)).toBe(true)
  })
})
