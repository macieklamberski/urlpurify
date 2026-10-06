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

  it('should extract a target without a scheme from the legacy path on www.facebook.com', () => {
    const url = new URL(
      'http://www.facebook.com/l/5AQHGK4rxAQGL-AEL93wViymSpBqLhKkJJR0sSF1hMP-V6w/rapidcityjournal.com/news/article_46a1b9aa',
    )

    expect(unwrapFacebookShim(url)).toBe('http://rapidcityjournal.com/news/article_46a1b9aa')
  })

  it('should keep the query of a target in the legacy path', () => {
    const url = new URL('http://www.facebook.com/l/mAQFYlx2o/www.youtube.com/watch?v=fZZhiF6z2sg')

    expect(unwrapFacebookShim(url)).toBe('http://www.youtube.com/watch?v=fZZhiF6z2sg')
  })

  it('should extract a target from the legacy path on l.facebook.com', () => {
    const url = new URL(
      'http://l.facebook.com/l/2AQEUvcwIAQHqTXiT8B3usUbA2R3i2FYxgJfBJXaRReZzbA/example.blogspot.com/',
    )

    expect(unwrapFacebookShim(url)).toBe('http://example.blogspot.com/')
  })

  it('should extract a target after a semicolon in the legacy path', () => {
    const url = new URL(
      'http://www.facebook.com/l/92723;https://www.paypal.com/cgi-bin/webscr?cmd=x',
    )

    expect(unwrapFacebookShim(url)).toBe('https://www.paypal.com/cgi-bin/webscr?cmd=x')
  })

  it('should decode an encoded target in the legacy path', () => {
    const url = new URL(
      'https://www.facebook.com/l/tAQGrQpNyAQGcNugK26MJo6I7u13EWjMs-gm8qDRbwkVYhQ/https%3A%2F%2Fwww.paypal.com%2Fcgi-bin%2Fwebscr%3Fcmd%3D_s-xclick%26hosted_button_id%3DQNGYF76RFWAHC',
    )

    expect(unwrapFacebookShim(url)).toBe(
      'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QNGYF76RFWAHC',
    )
  })

  it('should decode a half-encoded target in the legacy path', () => {
    const url = new URL(
      'https://www.facebook.com/l/sAQEFF71-AQGl56XZDFE3_XOX8b7wicBJuJHRag8_CrzStA/https%3A//www.youcaring.com/help-a-neighbor/165331',
    )

    expect(unwrapFacebookShim(url)).toBe('https://www.youcaring.com/help-a-neighbor/165331')
  })

  it('should decode a twice-encoded target in the legacy path', () => {
    const url = new URL(
      'https://l.facebook.com/l/jAQEpUZL6/https%253A%252F%252Fwww.poets.org%252Fpoet%252Fdavid-lehman',
    )

    expect(unwrapFacebookShim(url)).toBe('https://www.poets.org/poet/david-lehman')
  })

  it('should return undefined for a malformed encoded target in the legacy path', () => {
    const url = new URL('https://www.facebook.com/l/jAQEpUZL6/https%3A%2F%2Fexample.com%E0%A4%A')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })

  it('should return undefined for the legacy path without a token or a target', () => {
    expect(
      unwrapFacebookShim(new URL('http://www.facebook.com/l/;http://example.com/page')),
    ).toBeUndefined()
    expect(unwrapFacebookShim(new URL('http://www.facebook.com/l/mAQFYlx2o/'))).toBeUndefined()
    expect(unwrapFacebookShim(new URL('http://www.facebook.com/l/mAQFYlx2o'))).toBeUndefined()
  })

  it('should return undefined for the legacy path on another host', () => {
    const url = new URL('http://example.com/l/mAQFYlx2o/www.youtube.com/watch?v=fZZhiF6z2sg')

    expect(unwrapFacebookShim(url)).toBeUndefined()
  })
})
