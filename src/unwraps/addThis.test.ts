import { describe, expect, it } from 'bun:test'
import { unwrapAddThis } from './addThis.js'

describe('unwrapAddThis', () => {
  it('should extract the page from a bookmark link', () => {
    const value = new URL(
      'http://www.addthis.com/bookmark.php?v=250&winname=addthis&pub=ra-503b2408409d36d2&source=tbx-250&lng=ru&s=moikrug&url=http%3A%2F%2Fwww.example.com%2Fnews.asp%3Fmsg%3D434113&title=%D0%9F%D0%B5%D1%80%D0%B8%D0%BE%D0%B4',
    )
    const expected = 'http://www.example.com/news.asp?msg=434113'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should extract an unencoded page from a bookmark link', () => {
    const value = new URL(
      'http://www.addthis.com/bookmark.php?v=300&s=mendeley&url=https://example.org/wiki/WikiJournal_of_Medicine',
    )
    const expected = 'https://example.org/wiki/WikiJournal_of_Medicine'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should extract the page from a service offer link', () => {
    const value = new URL(
      'http://api.addthis.com/oexchange/0.8/forward/linkedin/offer?url=https://www.example.com/news/2019/04/ocean-s-tallest-waves-are-getting-taller&title=The%20ocean',
    )
    const expected = 'https://www.example.com/news/2019/04/ocean-s-tallest-waves-are-getting-taller'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should extract the page from the offer menu link', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0.8/offer?url=http%3A//www.example.com/Art-Galleries/Ceramics-Raku/20/Greek-Amphora/734844/',
    )
    const expected = 'http://www.example.com/Art-Galleries/Ceramics-Raku/20/Greek-Amphora/734844/'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0.8/forward/twitter/offer?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'http://www.addthis.com/Bookmark.php?s=twitter&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should match the offer path in any case', () => {
    const value = new URL(
      'https://api.addthis.com/OExchange/0.8/Forward/twitter/Offer?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapAddThis(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('http://www.addthis.com/bookmark.php?v=250&pub=ra-503b2408409d36d2')

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://www.addthis.com/bookmark.php?url=&title=Hello')

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for a page only in the title', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0.8/forward/twitter/offer?title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for the feed subscribe form', () => {
    const value = new URL(
      'http://www.addthis.com/feed.php?pub=ugnius&h1=http%3A%2F%2Fwww.example.com%2Ffeeds%2Farticles.xml&url=http%3A%2F%2Fwww.example.com%2Ffeeds%2Farticles.xml',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for the offer path under another path', () => {
    const value = new URL(
      'https://api.addthis.com/example/oexchange/0.8/offer?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for a path below the offer path', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0.8/offer/example?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for another oexchange version', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0x8/offer?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for a service path with an extra segment', () => {
    const value = new URL(
      'https://api.addthis.com/oexchange/0.8/forward/twitter/extra/offer?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for a carrier path on another addthis.com host', () => {
    const value = new URL(
      'https://api.addthis.com/bookmark.php?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/oexchange/0.8/offer?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapAddThis(value)).toBeUndefined()
  })
})
