import { describe, expect, it } from 'bun:test'
import { unwrapFacebookShim } from './facebook.js'

describe('unwrapFacebookShim', () => {
  it('should extract target from l.facebook.com', () => {
    const url = new URL('https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBe('https://example.com/page')
  })

  it('should extract target from lm.facebook.com', () => {
    const url = new URL('https://lm.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBe('https://example.com/page')
  })

  it('should extract target from l.messenger.com', () => {
    const url = new URL('https://l.messenger.com/l.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBe('https://example.com/page')
  })

  it('should return undefined for non-shim Facebook URLs', () => {
    const url = new URL('https://www.facebook.com/profile')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://l.facebook.com/l.php')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })

  it('should return undefined for non-Facebook hosts', () => {
    const url = new URL('https://example.com/l.php?u=https%3A%2F%2Fother.com')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })
})
