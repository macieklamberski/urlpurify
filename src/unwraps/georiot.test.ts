import { describe, expect, it } from 'bun:test'
import { unwrapGeoriot } from './georiot.js'

describe('unwrapGeoriot', () => {
  it('should extract target from GR_URL param', () => {
    const value = new URL(
      'https://target.georiot.com/Proxy.ashx?GR_URL=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapGeoriot(value)).toBe(expected)
  })

  it('should return undefined when GR_URL param is missing', () => {
    const value = new URL('https://target.georiot.com/Proxy.ashx?other=value')

    expect(unwrapGeoriot(value)).toBeUndefined()
  })

  it('should return undefined for non-georiot hosts', () => {
    const value = new URL('https://example.com/Proxy.ashx?GR_URL=https%3A%2F%2Fother.com')

    expect(unwrapGeoriot(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://target.georiot.com/?GR_URL=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGeoriot(value)).toBeUndefined()
  })
})
