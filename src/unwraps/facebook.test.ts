import { describe, expect, it } from 'bun:test'
import { unwrapFacebook } from './facebook.js'

describe('unwrapFacebook', () => {
  it('should extract target from l.facebook.com', () => {
    const value = new URL('https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should return undefined for the share intent on www.facebook.com', () => {
    const value = new URL('https://www.facebook.com/sharer.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should return undefined for non-shim Facebook URLs', () => {
    const value = new URL('https://www.facebook.com/profile')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://l.facebook.com/l.php')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should return undefined for non-Facebook hosts', () => {
    const value = new URL('https://example.com/l.php?u=https%3A%2F%2Fother.com')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should extract target from the root path on l.facebook.com', () => {
    const value = new URL(
      'http://l.facebook.com/?u=http%3A%2F%2Fexample.com%2Fpage%3Fa%3D1%26z%3D2&e=ATNt8VAv5DHBAf9_BeBUAgRUR',
    )
    const expected = 'http://example.com/page?a=1&z=2'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should extract target from /lsr.php on l.facebook.com', () => {
    const value = new URL(
      'http://l.facebook.com/lsr.php?u=http%3A%2F%2Fexample.com%2Fpage&ext=1412643317&hash=AcnaqSl-oP5KRrEKSkIxqQ',
    )
    const expected = 'http://example.com/page'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should decode a twice-encoded target on the root path', () => {
    const value = new URL('https://l.facebook.com/?u=https%253A%252F%252Fexample.com%252Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should return undefined for the root path without a u param', () => {
    expect(unwrapFacebook(new URL('https://l.facebook.com/'))).toBeUndefined()
    expect(unwrapFacebook(new URL('https://l.facebook.com/?u='))).toBeUndefined()
    expect(unwrapFacebook(new URL('https://l.facebook.com/lsr.php?ext=1'))).toBeUndefined()
  })

  it('should return undefined for a sibling path on l.facebook.com', () => {
    const value = new URL('https://l.facebook.com/sharer.php?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should return undefined for the root path on other Facebook hosts', () => {
    for (const host of [
      'www.facebook.com',
      'm.facebook.com',
      'lm.facebook.com',
      'facebook.com',
      'l.messenger.com',
    ]) {
      const value = new URL(`https://${host}/?u=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapFacebook(value)).toBeUndefined()
    }
  })

  it('should return undefined for /lsr.php on other Facebook hosts', () => {
    for (const host of ['www.facebook.com', 'lm.facebook.com', 'l.messenger.com', 'facebook.com']) {
      const value = new URL(`https://${host}/lsr.php?u=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapFacebook(value)).toBeUndefined()
    }
  })

  it('should return undefined for the root path on a lookalike host', () => {
    const value = new URL('https://l.examplefacebook.com/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should extract a target without a scheme from the legacy path on www.facebook.com', () => {
    const value = new URL(
      'http://www.facebook.com/l/5AQHGK4rxAQGL-AEL93wViymSpBqLhKkJJR0sSF1hMP-V6w/rapidcityjournal.com/news/article_46a1b9aa',
    )
    const expected = 'http://rapidcityjournal.com/news/article_46a1b9aa'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should drop the query of the link after an encoded target in the legacy path', () => {
    const value = new URL(
      'http://www.facebook.com/l/mAQFYlx2o/https%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3D7?ref=nf',
    )
    const expected = 'https://www.example.com/watch?v=7'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should extract a target from the legacy path on the bare facebook.com', () => {
    const value = new URL('http://facebook.com/l/mAQFYlx2o/www.example.com/watch?v=7')
    const expected = 'http://www.example.com/watch?v=7'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should keep the query of a target in the legacy path', () => {
    const value = new URL('http://www.facebook.com/l/mAQFYlx2o/www.youtube.com/watch?v=fZZhiF6z2sg')
    const expected = 'http://www.youtube.com/watch?v=fZZhiF6z2sg'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should extract a target from the legacy path on l.facebook.com', () => {
    const value = new URL(
      'http://l.facebook.com/l/2AQEUvcwIAQHqTXiT8B3usUbA2R3i2FYxgJfBJXaRReZzbA/example.blogspot.com/',
    )
    const expected = 'http://example.blogspot.com/'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should extract a target after a semicolon in the legacy path', () => {
    const value = new URL(
      'http://www.facebook.com/l/92723;https://www.paypal.com/cgi-bin/webscr?cmd=x',
    )
    const expected = 'https://www.paypal.com/cgi-bin/webscr?cmd=x'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should decode an encoded target in the legacy path', () => {
    const value = new URL(
      'https://www.facebook.com/l/tAQGrQpNyAQGcNugK26MJo6I7u13EWjMs-gm8qDRbwkVYhQ/https%3A%2F%2Fwww.paypal.com%2Fcgi-bin%2Fwebscr%3Fcmd%3D_s-xclick%26hosted_button_id%3DQNGYF76RFWAHC',
    )
    const expected =
      'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QNGYF76RFWAHC'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should decode a half-encoded target in the legacy path', () => {
    const value = new URL(
      'https://www.facebook.com/l/sAQEFF71-AQGl56XZDFE3_XOX8b7wicBJuJHRag8_CrzStA/https%3A//www.youcaring.com/help-a-neighbor/165331',
    )
    const expected = 'https://www.youcaring.com/help-a-neighbor/165331'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should decode a twice-encoded target in the legacy path', () => {
    const value = new URL(
      'https://l.facebook.com/l/jAQEpUZL6/https%253A%252F%252Fwww.poets.org%252Fpoet%252Fdavid-lehman',
    )
    const expected = 'https://www.poets.org/poet/david-lehman'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://l.facebook.com/l/jAQEpUZL6/https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'https://www.facebook.com/l/jAQEpUZL6/https%3A%2F%2Fexample.com%2F%E0%A4%A',
    )
    const expected = 'https://example.com/%E0%A4%A'

    expect(unwrapFacebook(value)).toBe(expected)
  })

  it('should return undefined for the legacy path without a token or a target', () => {
    const value = new URL('http://www.facebook.com/l/;http://example.com/page')

    expect(unwrapFacebook(value)).toBeUndefined()
    expect(unwrapFacebook(new URL('http://www.facebook.com/l/mAQFYlx2o/'))).toBeUndefined()
    expect(unwrapFacebook(new URL('http://www.facebook.com/l/mAQFYlx2o'))).toBeUndefined()
  })

  it('should return undefined for the legacy path on another host', () => {
    const value = new URL('http://example.com/l/mAQFYlx2o/www.youtube.com/watch?v=fZZhiF6z2sg')

    expect(unwrapFacebook(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://www.facebook.com/l/tAQGrQpNyAQGcNugK26MJo6I7u13EWjMs-gm8qDRbwkVYhQ/https%3A%2F%2Fwww.example.com%2Fdonate%23top',
    )
    const expected = 'https://www.example.com/donate#top'

    expect(unwrapFacebook(value)).toBe(expected)
  })
})
