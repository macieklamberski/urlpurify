import { describe, expect, it } from 'bun:test'
import { unwrapGeoriot } from './georiot.js'

describe('unwrapGeoriot', () => {
  it('should extract target from GR_URL param', () => {
    const url = new URL(
      'https://target.georiot.com/Proxy.ashx?GR_URL=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapGeoriot(url)).toBe('https://example.com/product')
  })

  it('should return undefined when GR_URL param is missing', () => {
    const url = new URL('https://target.georiot.com/Proxy.ashx?other=value')

    expect(unwrapGeoriot(url)).toBeUndefined()
  })

  it('should return undefined for non-georiot hosts', () => {
    const url = new URL('https://example.com/Proxy.ashx?GR_URL=https%3A%2F%2Fother.com')

    expect(unwrapGeoriot(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL(
      'https://www.georiot.com/Proxy.ashx?GR_URL=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGeoriot(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://target.georiot.com/?GR_URL=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGeoriot(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplegeoriot.com/Proxy.ashx?GR_URL=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGeoriot(url)).toBeUndefined()
  })
})
