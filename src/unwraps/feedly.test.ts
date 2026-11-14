import { describe, expect, it } from 'bun:test'
import { unwrapFeedly } from './feedly.js'

describe('unwrapFeedly', () => {
  describe('subscription path', () => {
    it('should extract a raw feed', () => {
      const value = new URL('http://feedly.com/i/subscription/feed/http://www.example.com/feed/')
      const expected = 'http://www.example.com/feed/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a feed with one slash after its scheme', () => {
      const value = new URL('https://feedly.com/i/subscription/feed/https:/blog.example.com/rss/')
      const expected = 'https:/blog.example.com/rss/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should keep the feed query', () => {
      const value = new URL('https://feedly.com/i/subscription/feed/http:/example.com/?feed=rss2')
      const expected = 'http:/example.com/?feed=rss2'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a feed without a scheme', () => {
      const value = new URL('https://feedly.com/i/subscription/feed/example.hatenablog.com/feed')
      const expected = 'example.hatenablog.com/feed'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should decode a feed encoded with its feed/ prefix', () => {
      const value = new URL(
        'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fexample.com%2Fc%2F10475.rss',
      )
      const expected = 'https://example.com/c/10475.rss'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a raw feed after an encoded feed/ prefix', () => {
      const value = new URL('https://feedly.com/i/subscription/feed%2Fhttps:/example.com/feed/')
      const expected = 'https:/example.com/feed/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should decode a feed with only its scheme colon encoded on cloud.feedly.com', () => {
      const value = new URL(
        'http://cloud.feedly.com/i/subscription/feed/https%3A//example.com/rss.aspx?path=gen',
      )
      const expected = 'https://example.com/rss.aspx?path=gen'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('https://feedly.com/I/Subscription/Feed/https://example.com/feed/')
      const expected = 'https://example.com/feed/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should return undefined for an empty feed path', () => {
      const value = new URL('https://feedly.com/i/subscription/feed/')

      expect(unwrapFeedly(value)).toBeUndefined()
    })

    it('should return undefined for a url param', () => {
      const value = new URL(
        'https://feedly.com/i/subscription/feed?url=https://example.com/feed&via=TrendWebDesign',
      )

      expect(unwrapFeedly(value)).toBeUndefined()
    })

    it('should return undefined for a feed path under another prefix', () => {
      const value = new URL('https://feedly.com/x/i/subscription/feed/https://example.com/feed/')

      expect(unwrapFeedly(value)).toBeUndefined()
    })

    it('should return undefined on a lookalike host', () => {
      const value = new URL(
        'https://examplefeedly.com/i/subscription/feed/https://example.com/feed',
      )

      expect(unwrapFeedly(value)).toBeUndefined()
    })
  })

  describe('discover path', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'https://feedly.com/i/discover/sources/search/feed/https://example.com/mment/feed.json',
      )
      const expected = 'https://example.com/mment/feed.json'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should decode a percent-encoded feed', () => {
      const value = new URL(
        'https://feedly.com/i/discover/sources/search/feed/https%3A%2F%2Fwww.example.com%2Fwordpress',
      )
      const expected = 'https://www.example.com/wordpress'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should return undefined for a search without the feed/ prefix', () => {
      const value = new URL(
        'https://feedly.com/i/discover/sources/search/http%3A%2F%2Fexample.com%2Ffeed%2F',
      )

      expect(unwrapFeedly(value)).toBeUndefined()
    })
  })

  describe('subscription fragment', () => {
    it('should extract a feed from the root fragment', () => {
      const value = new URL(
        'https://feedly.com/#subscription/feed/https://www.example.com/news/easter/index.rss',
      )
      const expected = 'https://www.example.com/news/easter/index.rss'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a feed from the fragment after /index.html', () => {
      const value = new URL(
        'https://feedly.com/index.html#subscription/feed/https://www.example.com/rss/reviews-rss-feed',
      )
      const expected = 'https://www.example.com/rss/reviews-rss-feed'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a feed from the fragment after /home on www.feedly.com', () => {
      const value = new URL('http://www.feedly.com/home#subscription/feed/http://example.com/feed/')
      const expected = 'http://example.com/feed/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should extract a feed from the fragment on cloud.feedly.com', () => {
      const value = new URL(
        'http://cloud.feedly.com/#subscription/feed/http://blog.example.com/feed/',
      )
      const expected = 'http://blog.example.com/feed/'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should keep the feed query inside the fragment', () => {
      const value = new URL('https://feedly.com/#subscription/feed/https://example.com/?feed=rss2')
      const expected = 'https://example.com/?feed=rss2'

      expect(unwrapFeedly(value)).toBe(expected)
    })

    it('should return undefined for another fragment route', () => {
      const value = new URL('https://feedly.com/#latest')

      expect(unwrapFeedly(value)).toBeUndefined()
    })

    it('should return undefined for the fragment after another path', () => {
      const value = new URL(
        'https://feedly.com/i/latest#subscription/feed/https://example.com/feed/',
      )

      expect(unwrapFeedly(value)).toBeUndefined()
    })
  })

  it('should return undefined for a feed Feedly hosts', () => {
    const value = new URL('https://feedly.com/f/nET1s29KtcNUjVuU2Ffu0fPn.atom')

    expect(unwrapFeedly(value)).toBeUndefined()
  })
})
