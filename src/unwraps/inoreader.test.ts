import { describe, expect, it } from 'bun:test'
import { unwrapInoreader } from './inoreader.js'

describe('unwrapInoreader', () => {
  describe('add_feed link', () => {
    it('should extract a percent-encoded add_feed', () => {
      const value = new URL(
        'http://www.inoreader.com/?add_feed=https%3A%2F%2Fwww.example.it%2Ffeed%2F',
      )
      const expected = 'https://www.example.it/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should extract a raw add_feed', () => {
      const value = new URL(
        'https://www.inoreader.com/?add_feed=https://example.com/topic/93185.rss',
      )
      const expected = 'https://example.com/topic/93185.rss'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should extract an add_feed on the bare host', () => {
      const value = new URL('https://inoreader.com/?add_feed=https%3A%2F%2Fexample.com%2Ffeed%2F')
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should decode a twice-encoded add_feed', () => {
      const value = new URL(
        'https://www.inoreader.com/?add_feed=https%253A%252F%252Fexample.com%252Ffeed%252F',
      )
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should return undefined for an empty add_feed', () => {
      const value = new URL('https://www.inoreader.com/?add_feed=')

      expect(unwrapInoreader(value)).toBeUndefined()
    })

    it('should return undefined for add_feed on another path', () => {
      const value = new URL(
        'https://www.inoreader.com/login?add_feed=https%3A%2F%2Fexample.com%2Ffeed%2F',
      )

      expect(unwrapInoreader(value)).toBeUndefined()
    })
  })

  describe('feed path', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'https://www.inoreader.com/feed/https%3A%2F%2Fwww.inoreader.com%2Fblog%2Ffeed',
      )
      const expected = 'https://www.inoreader.com/blog/feed'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should extract a feed on the Japanese host', () => {
      const value = new URL(
        'https://jp.inoreader.com/feed/http%3A%2F%2Fnews.example.co.uk%2Frss%2Fsportonline_world_edition%2Ftennis%2Frss091.xml',
      )
      const expected = 'http://news.example.co.uk/rss/sportonline_world_edition/tennis/rss091.xml'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should decode a feed with its own query', () => {
      const value = new URL(
        'https://www.inoreader.com/feed/https%3A%2F%2Fwww.example.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCM32VQIuifZBYrYDbewsU0A',
      )
      const expected =
        'https://www.example.com/feeds/videos.xml?channel_id=UCM32VQIuifZBYrYDbewsU0A'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should extract a raw feed', () => {
      const value = new URL('https://www.inoreader.com/feed/https://example.com/feed/')
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should drop the Inoreader query after the feed', () => {
      const value = new URL(
        'https://www.inoreader.com/feed/https%3A%2F%2Fexample.com%2Ffeed%2F?utm_source=share',
      )
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'https://www.inoreader.com/feed/https%253A%252F%252Fexample.com%252Ffeed%252F',
      )
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('https://www.inoreader.com/Feed/https%3A%2F%2Fexample.com%2Ffeed%2F')
      const expected = 'https://example.com/feed/'

      expect(unwrapInoreader(value)).toBe(expected)
    })

    it('should return undefined for a non-http feed', () => {
      const value = new URL('https://www.inoreader.com/feed/ftp%3A%2F%2Fexample.com%2Ffeed')

      expect(unwrapInoreader(value)).toBeUndefined()
    })

    it('should return undefined for an empty feed path', () => {
      const value = new URL('https://www.inoreader.com/feed/')

      expect(unwrapInoreader(value)).toBeUndefined()
    })

    it('should return undefined for a feed path on another host', () => {
      const value = new URL('https://notinoreader.com/feed/https%3A%2F%2Fexample.com%2Ffeed%2F')

      expect(unwrapInoreader(value)).toBeUndefined()
    })

    it('should return undefined for a feed path under another prefix', () => {
      const value = new URL('https://www.inoreader.com/x/feed/https%3A%2F%2Fexample.com%2Ffeed%2F')

      expect(unwrapInoreader(value)).toBeUndefined()
    })
  })

  it('should return undefined for a feed search', () => {
    const value = new URL(
      'https://www.inoreader.com/search/feeds/https%3A%2F%2Fexample.co%2Fmment%2Ffeed.json',
    )

    expect(unwrapInoreader(value)).toBeUndefined()
  })

  it('should return undefined for a tag stream view', () => {
    const value = new URL(
      'https://www.inoreader.com/stream/user/1005920198/tag/example.net/view/html?l=https%3A%2F%2Fexample.com%2Fimage.jpg',
    )

    expect(unwrapInoreader(value)).toBeUndefined()
  })
})
