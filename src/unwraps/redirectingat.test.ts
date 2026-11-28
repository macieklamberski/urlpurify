import { describe, expect, it } from 'bun:test'
import { unwrapRedirectingat } from './redirectingat.js'

describe('unwrapRedirectingat', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://redirectingat.com/?url=https%3A%2F%2Fexample.com%2Fproduct')
    const expected = 'https://example.com/product'

    expect(unwrapRedirectingat(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://go.redirectingat.com/?id=12345X678&xs=1&url=https://example.com/wnba/',
    )
    const expected = 'https://example.com/wnba/'

    expect(unwrapRedirectingat(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://go.redirectingat.com/?id=12345X678&xs=1')

    expect(unwrapRedirectingat(value)).toBeUndefined()
  })

  it('should return undefined for non-redirectingat hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapRedirectingat(value)).toBeUndefined()
  })

  it('should return undefined for another path on redirectingat.com', () => {
    const value = new URL(
      'https://go.redirectingat.com/about?url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapRedirectingat(value)).toBeUndefined()
  })
})
