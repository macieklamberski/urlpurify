import { describe, expect, it } from 'bun:test'
import { unwrapShareaholic } from './shareaholic.js'

describe('unwrapShareaholic', () => {
  it('should extract an unencoded page from a share link', () => {
    const value = new URL(
      'http://www.shareaholic.com/api/share/?title=Aufkl%C3%A4rung+statt+Verbote&link=http://example.com/blog/rekru/brennerei-kellerei-mosterei/aufklaerung-statt-verbote/&notes=Alkoholische%20Getr%C3%A4nke&short_link=&shortener=google&shortener_key=&v=1&apitype=1&apikey=8afa39428933be41f8afdb8ea21a495c&source=Shareaholic&template=&service=5&tags=&ctype=',
    )
    const expected =
      'http://example.com/blog/rekru/brennerei-kellerei-mosterei/aufklaerung-statt-verbote/'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should extract a percent-encoded page from a share link', () => {
    const value = new URL(
      'http://www.shareaholic.com/api/share/?title=Republica.com&link=http%3A%2F%2Fexample.com%2F2012%2F02%2F29%2Fcontemporanea-lleva-a-finestra-supergrafika_458581%2F&notes=SuperGrafika&short_link=&v=1&apitype=1&apikey=8afa39428933be41f8afdb8ea21a495c&source=Shareaholic&template=&service=7&tags=&ctype=',
    )
    const expected =
      'http://example.com/2012/02/29/contemporanea-lleva-a-finestra-supergrafika_458581/'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should extract the page from the path without a trailing slash', () => {
    const value = new URL(
      'https://www.shareaholic.com/api/share?title=Example&link=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )
    const expected = 'https://example.com/post'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should extract the page on the bare host', () => {
    const value = new URL(
      'https://shareaholic.com/api/share/?title=Example&link=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )
    const expected = 'https://example.com/post'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should extract the page from an uppercase path', () => {
    const value = new URL(
      'https://www.shareaholic.com/API/Share/?link=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )
    const expected = 'https://example.com/post'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.shareaholic.com/api/share/?link=https%253A%252F%252Fexample.com%252Fpost&service=5',
    )
    const expected = 'https://example.com/post'

    expect(unwrapShareaholic(value)).toBe(expected)
  })

  it('should return undefined when the link is missing', () => {
    const value = new URL('https://www.shareaholic.com/api/share/?title=Example&service=5')

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined when the link is empty', () => {
    const value = new URL('https://www.shareaholic.com/api/share/?title=Example&link=&service=5')

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined for a url in the title', () => {
    const value = new URL(
      'https://www.shareaholic.com/api/share/?title=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined for a url param the endpoint rejects', () => {
    const value = new URL(
      'https://www.shareaholic.com/api/share/?url=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.shareaholic.com/api/shares/?link=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined for the share path under another segment', () => {
    const value = new URL(
      'https://www.shareaholic.com/x/api/share/?link=https%3A%2F%2Fexample.com%2Fpost&service=5',
    )

    expect(unwrapShareaholic(value)).toBeUndefined()
  })

  it('should return undefined for the share path on another host', () => {
    const value = new URL(
      'https://example.com/api/share/?link=https%3A%2F%2Fexample.org%2Fpost&service=5',
    )

    expect(unwrapShareaholic(value)).toBeUndefined()
  })
})
