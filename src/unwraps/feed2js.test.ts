import { describe, expect, it } from 'bun:test'
import { cleanUrl } from '../clean.js'
import { unwrapFeed2js } from './feed2js.js'

describe('unwrapFeed2js', () => {
  describe('feed2js.org', () => {
    it('should extract a percent-encoded feed and end it before the widget options', () => {
      const value = new URL(
        'http://feed2js.org/feed2js.php?src=http%3A%2F%2Ffeeds.example.com%2FDiscoveryNews-Top-Stories&chan=y&num=10&date=y&targ=y&utf=y&html=a',
      )
      const expected = 'http://feeds.example.com/DiscoveryNews-Top-Stories'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should keep the query of a percent-encoded feed', () => {
      const value = new URL(
        'http://feed2js.org/feed2js.php?src=http%3A%2F%2Fexample.com%2Ffeeds%2Fposts%2Fdefault%3Falt%3Drss&chan=y&num=3&targ=y&utf=y&html=a',
      )
      const expected = 'http://example.com/feeds/posts/default?alt=rss'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should extract a raw feed from the www host', () => {
      const value = new URL(
        'http://www.feed2js.org/feed2js.php?src=https://example.com/p/xbJ4XD/ana-sayfa',
      )
      const expected = 'https://example.com/p/xbJ4XD/ana-sayfa'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should unwrap a path opening on a doubled slash', () => {
      const value =
        'http://feed2js.org//feed2js.php?src=http%3A%2F%2Ffeeds.example.com%2FNF-ExpiringInstantTitles&html=a'
      const expected = 'http://feeds.example.com/NF-ExpiringInstantTitles'

      expect(cleanUrl(value, { unwrappers: [unwrapFeed2js] })).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'http://feed2js.org/feed2js.php?src=https%253A%252F%252Fexample.com%252Ffeed%252F',
      )
      const expected = 'https://example.com/feed/'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('http://feed2js.org/Feed2JS.php?src=https://example.com/feed/')
      const expected = 'https://example.com/feed/'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should return undefined without a carrier', () => {
      const value = new URL('http://feed2js.org/feed2js.php?chan=y&num=10')

      expect(unwrapFeed2js(value)).toBeUndefined()
    })

    it('should return undefined for an empty carrier', () => {
      const value = new URL('http://feed2js.org/feed2js.php?src=&chan=y')

      expect(unwrapFeed2js(value)).toBeUndefined()
    })

    it('should return undefined for the feedroll.com path', () => {
      const value = new URL(
        'http://feed2js.org/rssviewer/feed2js.php?src=https://example.com/feed/',
      )

      expect(unwrapFeed2js(value)).toBeUndefined()
    })
  })

  describe('feedroll.com', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'https://feedroll.com/rssviewer/feed2js.php?src=http://example.com/music',
      )
      const expected = 'http://example.com/music'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should extract a raw feed from the www host', () => {
      const value = new URL(
        'https://www.feedroll.com/rssviewer/feed2js.php?src=https://example.com/p/xbJ4XD/ana-sayfa',
      )
      const expected = 'https://example.com/p/xbJ4XD/ana-sayfa'

      expect(unwrapFeed2js(value)).toBe(expected)
    })

    it('should return undefined for feed2js.php outside the rssviewer folder', () => {
      const value = new URL('https://feedroll.com/feed2js.php?src=https://example.com/feed/')

      expect(unwrapFeed2js(value)).toBeUndefined()
    })
  })

  describe('another host', () => {
    it('should return undefined for a Feed2JS copy on another host', () => {
      const value = new URL('https://example.com/feed2js/feed2js.php?src=https://example.org/feed/')

      expect(unwrapFeed2js(value)).toBeUndefined()
    })
  })
})
