import { describe, expect, it } from 'bun:test'
import { unwrapRedirectingat } from './redirectingat.js'

describe('unwrapRedirectingat', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://redirectingat.com/?url=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapRedirectingat(url)).toBe('https://example.com/product')
  })

  it('should extract target on the go subdomain', () => {
    const url = new URL(
      'https://go.redirectingat.com/?id=12345X678&xs=1&url=https%3A%2F%2Fexample.com%2Fproduct&xcust=abc&sref=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapRedirectingat(url)).toBe('https://example.com/product')
  })

  it('should extract target on the wordpress subdomain', () => {
    const url = new URL(
      'http://wordpress.redirectingat.com/?id=12345X678&site=example.wordpress.com&xs=1&url=http%3A%2F%2Fexample.com%2Falbum',
    )

    expect(unwrapRedirectingat(url)).toBe('http://example.com/album')
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
})
