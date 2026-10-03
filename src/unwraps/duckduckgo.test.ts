import { describe, expect, it } from 'bun:test'
import { unwrapDuckduckgo } from './duckduckgo.js'

describe('unwrapDuckduckgo', () => {
  it('should extract target from uddg param', () => {
    const url = new URL('https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDuckduckgo(url)).toBe('https://example.com/page')
  })

  it('should extract target from u3 param on the ad click', () => {
    const url = new URL(
      'https://duckduckgo.com/y.js?ad_domain=example.com&ad_provider=bingv7aa&ad_type=txad&eddgt=pROwpFNkFxr%2Ddox5u8MG4Q%3D%3D&rut=650d93be3048d10a42ec7a7aa3acda3b0f5fdc73f952aa37ac5e2e48705cc059&u3=https%3A%2F%2Fexample.com%2Fproduct%3Fid%3D42&vqd=4-1234567890',
    )

    expect(unwrapDuckduckgo(url)).toBe('https://example.com/product?id=42')
  })

  it('should extract target from u2 param on the ad click', () => {
    const url = new URL(
      'https://duckduckgo.com/y.js?u2=http%3A%2F%2Fwww.example.com%2Fdp%2FB003V8B5XO&a=ffsb',
    )

    expect(unwrapDuckduckgo(url)).toBe('http://www.example.com/dp/B003V8B5XO')
  })

  it('should return undefined when u3 param is empty', () => {
    const url = new URL('https://duckduckgo.com/y.js?ad_provider=bingv7aa&u3=')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for the u param on the /k/ path', () => {
    const url = new URL('https://duckduckgo.com/k/?u=http%3A%2F%2Fwww.example.com%2Fbook.pdf')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for the ad click on a lookalike host', () => {
    const url = new URL('https://exampleduckduckgo.com/y.js?u3=https%3A%2F%2Fexample.com')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined when uddg param is missing', () => {
    const url = new URL('https://duckduckgo.com/l/?other=value')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for paths other than /l/', () => {
    const url = new URL('https://duckduckgo.com/?uddg=https%3A%2F%2Fexample.com')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for non-DuckDuckGo hosts', () => {
    const url = new URL('https://example.com/l/?uddg=https%3A%2F%2Fother.com')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })
})
