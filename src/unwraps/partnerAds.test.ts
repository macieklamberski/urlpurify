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

  it('should extract target on the bare domain', () => {
    const url = new URL(
      'https://partner-ads.com/dk/klikbanner.php?htmlurl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPartnerAds(url)).toBe('https://example.com/post')
  })
})
