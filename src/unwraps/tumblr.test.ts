import { describe, expect, it } from 'bun:test'
import { unwrapTumblr } from './tumblr.js'

describe('unwrapTumblr', () => {
  it('should extract target from z param', () => {
    const value = new URL(
      'https://t.umblr.com/redirect?z=https%3A%2F%2Fexample.com%2Fpost&t=signature',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTumblr(value)).toBe(expected)
  })

  it('should return undefined when z param is missing', () => {
    const value = new URL('https://t.umblr.com/redirect?t=signature')

    expect(unwrapTumblr(value)).toBeUndefined()
  })

  it('should return undefined for non-redirect Tumblr paths', () => {
    const value = new URL('https://t.umblr.com/dashboard?z=https%3A%2F%2Fexample.com')

    expect(unwrapTumblr(value)).toBeUndefined()
  })

  it('should return undefined for non-Tumblr hosts', () => {
    const value = new URL('https://example.com/redirect?z=https%3A%2F%2Fother.com')

    expect(unwrapTumblr(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://x.umblr.com/redirect?z=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTumblr(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://exampleumblr.com/redirect?z=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTumblr(value)).toBeUndefined()
  })
})
