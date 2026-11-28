import { describe, expect, it } from 'bun:test'
import { unwrapWorldNomads } from './worldNomads.js'

describe('unwrapWorldNomads', () => {
  it('should extract target from path param on the Turnstile path', () => {
    const value = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=&path=https://www.example.com/travel-insurance&utm_source=lifeseasia&utm_content=link',
    )
    const expected = 'https://www.example.com/travel-insurance'

    expect(unwrapWorldNomads(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=&path=https%253A%252F%252Fexample.org%252Fpage&utm_source=lifeseasia&utm_content=link',
    )
    const expected = 'https://example.org/page'

    expect(unwrapWorldNomads(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=&path=https://example.org/search/a+b&utm_source=lifeseasia&utm_content=link',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapWorldNomads(value)).toBe(expected)
  })

  it('should extract target from path param on af.aspx', () => {
    const value = new URL(
      'http://www.worldnomads.com/af.aspx?affiliate=destgrow&subid=&path=http://www.example.com/insurance.aspx&utm_source=destgrow&utm_medium=textlink',
    )
    const expected = 'http://www.example.com/insurance.aspx'

    expect(unwrapWorldNomads(value)).toBe(expected)
  })

  it('should extract the last path when a Turnstile link is nested unencoded', () => {
    const value = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=2hw900&utm_source=2hw900&source=weblink&utm_content=weblink&path=https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=2hw900&source=link&utm_source=2hw900&utm_content=link&path=https://www.example.com/travel-insurance/',
    )
    const expected = 'https://www.example.com/travel-insurance/'

    expect(unwrapWorldNomads(value)).toBe(expected)
  })

  it('should return undefined when path param is missing', () => {
    const value = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=',
    )

    expect(unwrapWorldNomads(value)).toBeUndefined()
  })

  it('should return undefined for a content page carrying the affiliate params', () => {
    const value = new URL(
      'https://www.worldnomads.com/travel-insurance/why-buy/insurance-faq?affiliate=hzultd&subid=&path=https://www.example.com/travel-insurance/why-buy/insurance-faq',
    )

    expect(unwrapWorldNomads(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/Turnstile/AffiliateLink?partnerCode=x&path=https://www.example.org/',
    )

    expect(unwrapWorldNomads(value)).toBeUndefined()
  })
})
