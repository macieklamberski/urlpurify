import { describe, expect, it } from 'bun:test'
import { unwrapDuckduckgoAds } from './duckduckgoAds.js'

describe('unwrapDuckduckgoAds', () => {
  it('should extract target from u3 param', () => {
    const value = new URL(
      'https://duckduckgo.com/y.js?ad_domain=example.com&ad_provider=bingv7aa&ad_type=txad&eddgt=pROwpFNkFxr%2Ddox5u8MG4Q%3D%3D&rut=650d93be3048d10a42ec7a7aa3acda3b0f5fdc73f952aa37ac5e2e48705cc059&u3=https%3A%2F%2Fexample.com%2Fproduct%3Fid%3D42&vqd=4-1234567890',
    )
    const expected = 'https://example.com/product?id=42'

    expect(unwrapDuckduckgoAds(value)).toBe(expected)
  })

  it('should extract target from u2 param', () => {
    const value = new URL(
      'https://duckduckgo.com/y.js?u2=http%3A%2F%2Fwww.example.com%2Fdp%2FB003V8B5XO&a=ffsb',
    )
    const expected = 'http://www.example.com/dp/B003V8B5XO'

    expect(unwrapDuckduckgoAds(value)).toBe(expected)
  })

  it('should return undefined when u3 param is empty', () => {
    const value = new URL('https://duckduckgo.com/y.js?ad_provider=bingv7aa&u3=')

    expect(unwrapDuckduckgoAds(value)).toBeUndefined()
  })

  it('should return undefined for u3 param outside the ad click path', () => {
    const value = new URL('https://duckduckgo.com/?u3=https%3A%2F%2Fexample.com')

    expect(unwrapDuckduckgoAds(value)).toBeUndefined()
  })

  it('should return undefined for the search-result redirect', () => {
    const value = new URL('https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDuckduckgoAds(value)).toBeUndefined()
  })

  it('should return undefined for the ad click on r.duckduckgo.com', () => {
    const value = new URL('https://r.duckduckgo.com/y.js?u3=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDuckduckgoAds(value)).toBeUndefined()
  })
})
