import { describe, expect, it } from 'bun:test'
import { unwrapPxf } from './pxf.js'

describe('unwrapPxf', () => {
  it('should extract target from u param on a merchant subdomain', () => {
    const url = new URL('https://merchant.pxf.io/?subId1=abc&u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapPxf(url)).toBe('https://example.com/product')
  })

  it('should match different merchant subdomains', () => {
    const url = new URL('https://shop-store.pxf.io/?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapPxf(url)).toBe('https://example.com/item')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://merchant.pxf.io/?subId1=abc')

    expect(unwrapPxf(url)).toBeUndefined()
  })

  it('should return undefined for non-pxf hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapPxf(url)).toBeUndefined()
  })

  it('should extract target from the click path', () => {
    const url = new URL(
      'https://alltrails.pxf.io/c/1234567/654321/9876?u=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPxf(url)).toBe('https://example.com/post')
  })

  it('should extract target from a short code path', () => {
    const url = new URL('https://merchant.pxf.io/dOax33?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPxf(url)).toBe('https://example.com/post')
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplepxf.io/?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPxf(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://merchant.pxf.io/c/about/us?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPxf(url)).toBeUndefined()
  })

  it('should extract target from a click path with a mangled tail', () => {
    const url = new URL(
      'https://merchant.pxf.io/c/381569/1https://merchant.pxf.io/c/381569/1448521/17195?u=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapPxf(url)).toBe('https://example.com/product')
  })

  it('should return undefined for a click path without a second numeric id', () => {
    const url = new URL('https://merchant.pxf.io/c/123/about?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPxf(url)).toBeUndefined()
  })
})
