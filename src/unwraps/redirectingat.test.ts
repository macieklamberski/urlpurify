import { describe, expect, it } from 'bun:test'
import { unwrapRedirectingat } from './redirectingat.js'

describe('unwrapRedirectingat', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://redirectingat.com/?url=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapRedirectingat(url)).toBe('https://example.com/product')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://go.redirectingat.com/?id=12345X678&xs=1&url=https://example.com/wnba/',
    )

    expect(unwrapRedirectingat(url)).toBe('https://example.com/wnba/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://go.redirectingat.com/?id=12345X678&xs=1')

    expect(unwrapRedirectingat(url)).toBeUndefined()
  })

  it('should return undefined for non-redirectingat hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapRedirectingat(url)).toBeUndefined()
  })

  it('should return undefined for another path on redirectingat.com', () => {
    const url = new URL(
      'https://go.redirectingat.com/about?url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapRedirectingat(url)).toBeUndefined()
  })
})
