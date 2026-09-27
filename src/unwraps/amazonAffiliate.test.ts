import { describe, expect, it } from 'bun:test'
import { unwrapAmazonAffiliate } from './amazonAffiliate.js'

describe('unwrapAmazonAffiliate', () => {
  it('should extract target URL appended after the click id', () => {
    const url = new URL(
      'https://aax-us-east.amazon-adsystem.com/x/c/abc123/https://www.amazon.com/dp/B0EXAMPLE',
    )

    expect(unwrapAmazonAffiliate(url)).toBe('https://www.amazon.com/dp/B0EXAMPLE')
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://aax-us-east.amazon-adsystem.com/x/c/abc123/https://www.amazon.com/dp/B0EXAMPLE?th=1',
    )

    expect(unwrapAmazonAffiliate(url)).toBe('https://www.amazon.com/dp/B0EXAMPLE?th=1')
  })

  it('should accept http:// targets', () => {
    const url = new URL('https://aax-eu.amazon-adsystem.com/x/c/xyz789/http://example.com/page')

    expect(unwrapAmazonAffiliate(url)).toBe('http://example.com/page')
  })

  it('should return undefined when the path lacks an embedded URL', () => {
    const url = new URL('https://aax-us-east.amazon-adsystem.com/x/c/abc123/')

    expect(unwrapAmazonAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for non-tracker paths', () => {
    const url = new URL(
      'https://aax-us-east.amazon-adsystem.com/aap/?id=abc&dest=https%3A%2F%2Fexample.com',
    )

    expect(unwrapAmazonAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for non-Amazon hosts', () => {
    const url = new URL('https://example.com/x/c/abc/https://other.com/dp/X')

    expect(unwrapAmazonAffiliate(url)).toBeUndefined()
  })
})
