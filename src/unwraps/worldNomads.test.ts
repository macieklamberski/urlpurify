import { describe, expect, it } from 'bun:test'
import { unwrapWorldNomads } from './worldNomads.js'

describe('unwrapWorldNomads', () => {
  it('should extract target from path param on the Turnstile path', () => {
    const url = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=&path=https://www.example.com/travel-insurance&utm_source=lifeseasia&utm_content=link',
    )

    expect(unwrapWorldNomads(url)).toBe('https://www.example.com/travel-insurance')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=&path=https://example.org/search/a+b&utm_source=lifeseasia&utm_content=link',
    )

    expect(unwrapWorldNomads(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target from path param on af.aspx', () => {
    const url = new URL(
      'http://www.worldnomads.com/af.aspx?affiliate=destgrow&subid=&path=http://www.example.com/insurance.aspx&utm_source=destgrow&utm_medium=textlink',
    )

    expect(unwrapWorldNomads(url)).toBe('http://www.example.com/insurance.aspx')
  })

  it('should extract the last path when a Turnstile link is nested unencoded', () => {
    const url = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=2hw900&utm_source=2hw900&source=weblink&utm_content=weblink&path=https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=2hw900&source=link&utm_source=2hw900&utm_content=link&path=https://www.example.com/travel-insurance/',
    )

    expect(unwrapWorldNomads(url)).toBe('https://www.example.com/travel-insurance/')
  })

  it('should return undefined when path param is missing', () => {
    const url = new URL(
      'https://www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=lifeseasia&source=',
    )

    expect(unwrapWorldNomads(url)).toBeUndefined()
  })

  it('should return undefined for a content page carrying the affiliate params', () => {
    const url = new URL(
      'https://www.worldnomads.com/travel-insurance/why-buy/insurance-faq?affiliate=hzultd&subid=&path=https://www.example.com/travel-insurance/why-buy/insurance-faq',
    )

    expect(unwrapWorldNomads(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/Turnstile/AffiliateLink?partnerCode=x&path=https://www.example.org/',
    )

    expect(unwrapWorldNomads(url)).toBeUndefined()
  })
})
