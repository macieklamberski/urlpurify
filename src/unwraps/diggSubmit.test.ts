import { describe, expect, it } from 'bun:test'
import { unwrapDiggSubmit } from './diggSubmit.js'

describe('unwrapDiggSubmit', () => {
  it('should extract the page from a submit link', () => {
    const value = new URL(
      'http://digg.com/submit?phase=2&url=http%3A%2F%2Fexample.com%2Fnwsrm%2Ftxtps%2F2016%2Ftfsk15-eng.html%3Frss&title=Do%20you%20owe%20income%20tax%3F',
    )
    const expected = 'http://example.com/nwsrm/txtps/2016/tfsk15-eng.html?rss'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should extract the page from a share link', () => {
    const value = new URL(
      'http://digg.com/share?url=https%3A%2F%2Fexample.com%2Fchina-not-yet-superpower&title=CHINA%2C%20NOT%20YET%20A%20SUPERPOWER',
    )
    const expected = 'https://example.com/china-not-yet-superpower'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should extract the page from a Digg This login link', () => {
    const value = new URL(
      'http://digg.com/tools/diggthis/login?url=http://example.com/2010/08/16/apples-steve-wozniak-to-appear-on-big-bang-theory/&title=Apple%E2%80%99s%20Steve%20Wozniak&related=true&style=true',
    )
    const expected =
      'http://example.com/2010/08/16/apples-steve-wozniak-to-appear-on-big-bang-theory/'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should extract the page on the www host', () => {
    const value = new URL(
      'http://www.digg.com/submit?phase=2&url=http%3A%2F%2Fexample.com%2Fpost&title=Hello',
    )
    const expected = 'http://example.com/post'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should extract an unencoded page with a trailing slash on the path', () => {
    const value = new URL(
      'http://digg.com/submit/?url=http://example.com/blog/post/2010/10/16/New-promo-video-for-ezyTip.aspx',
    )
    const expected = 'http://example.com/blog/post/2010/10/16/New-promo-video-for-ezyTip.aspx'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL('http://digg.com/submit?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://digg.com/Submit?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDiggSubmit(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('http://digg.com/submit?phase=2&title=Hello')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://digg.com/submit?phase=2&url=&title=Hello')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined for a page in the title', () => {
    const value = new URL('http://digg.com/submit?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('http://digg.com/news/technology?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined for a path that starts with the submit path', () => {
    const value = new URL('http://digg.com/submitted?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined for a path that ends with the submit path', () => {
    const value = new URL('http://digg.com/news/submit?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://example.com/submit?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiggSubmit(value)).toBeUndefined()
  })
})
