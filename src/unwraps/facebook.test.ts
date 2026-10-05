import { describe, expect, it } from 'bun:test'
import { unwrapFacebookShim } from './facebook.js'

describe('unwrapFacebookShim', () => {
  it('should extract target from l.facebook.com', () => {
    const url = new URL('https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBe('https://example.com/page')
  })

  it('should return undefined for the share intent on www.facebook.com', () => {
    const url = new URL('https://www.facebook.com/sharer.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBeUndefined()
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

  it('should extract target from the root path on l.facebook.com', () => {
    const url = new URL(
      'http://l.facebook.com/?u=http%3A%2F%2Fexample.com%2Fpage%3Fa%3D1%26z%3D2&e=ATNt8VAv5DHBAf9_BeBUAgRUR',
    )

    expect(unwrapFacebookShim(url)).toBe('http://example.com/page?a=1&z=2')
  })

  it('should extract target from /lsr.php on l.facebook.com', () => {
    const url = new URL(
      'http://l.facebook.com/lsr.php?u=http%3A%2F%2Fexample.com%2Fpage&ext=1412643317&hash=AcnaqSl-oP5KRrEKSkIxqQ',
    )

    expect(unwrapFacebookShim(url)).toBe('http://example.com/page')
  })

  it('should decode a twice-encoded target on the root path', () => {
    const url = new URL('https://l.facebook.com/?u=https%253A%252F%252Fexample.com%252Fpage')

    expect(unwrapFacebookShim(url)).toBe('https://example.com/page')
  })

  it('should return undefined for the root path without a u param', () => {
    expect(unwrapFacebookShim(new URL('https://l.facebook.com/'))).toBeUndefined()
    expect(unwrapFacebookShim(new URL('https://l.facebook.com/?u='))).toBeUndefined()
    expect(unwrapFacebookShim(new URL('https://l.facebook.com/lsr.php?ext=1'))).toBeUndefined()
  })

  it('should return undefined for a sibling path on l.facebook.com', () => {
    const url = new URL('https://l.facebook.com/sharer.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })

  it('should return undefined for the root path on other Facebook hosts', () => {
    for (const host of [
      'www.facebook.com',
      'm.facebook.com',
      'lm.facebook.com',
      'facebook.com',
      'l.messenger.com',
    ]) {
      const url = new URL(`https://${host}/?u=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapFacebookShim(url)).toBeUndefined()
    }
  })

  it('should return undefined for /lsr.php on other Facebook hosts', () => {
    for (const host of ['www.facebook.com', 'lm.facebook.com', 'l.messenger.com', 'facebook.com']) {
      const url = new URL(`https://${host}/lsr.php?u=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapFacebookShim(url)).toBeUndefined()
    }
  })

  it('should return undefined for the root path on a lookalike host', () => {
    const url = new URL('https://l.examplefacebook.com/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })
})
