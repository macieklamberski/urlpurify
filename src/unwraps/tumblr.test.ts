import { describe, expect, it } from 'bun:test'
import { unwrapTumblr } from './tumblr.js'

describe('unwrapTumblr', () => {
  it('should extract target from z param', () => {
    const url = new URL(
      'https://t.umblr.com/redirect?z=https%3A%2F%2Fexample.com%2Fpost&t=signature',
    )

    expect(unwrapTumblr(url)).toBe('https://example.com/post')
  })

  it('should return undefined when z param is missing', () => {
    const url = new URL('https://t.umblr.com/redirect?t=signature')

    expect(unwrapTumblr(url)).toBeUndefined()
  })

  it('should return undefined for non-redirect Tumblr paths', () => {
    const url = new URL('https://t.umblr.com/dashboard?z=https%3A%2F%2Fexample.com')

    expect(unwrapTumblr(url)).toBeUndefined()
  })

  it('should return undefined for non-Tumblr hosts', () => {
    const url = new URL('https://example.com/redirect?z=https%3A%2F%2Fother.com')

    expect(unwrapTumblr(url)).toBeUndefined()
  })
})
