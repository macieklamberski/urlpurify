import { describe, expect, it } from 'bun:test'
import { unwrapMorss } from './morss.js'

describe('unwrapMorss', () => {
  describe('feed in the path', () => {
    it('should extract a feed with a single slash after its scheme', () => {
      const value = new URL('https://morss.it/https:/www.example.com/feed')
      const expected = 'https:/www.example.com/feed'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should extract a feed with its full scheme', () => {
      const value = new URL('https://morss.it/https://blog.example.com/feeds/posts/default')
      const expected = 'https://blog.example.com/feeds/posts/default'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should extract a feed without a scheme as http', () => {
      const value = new URL('https://morss.it/planet.example.com/rss20.xml')
      const expected = 'http://planet.example.com/rss20.xml'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should keep the feed query', () => {
      const value = new URL('https://morss.it/https://blog.example.com/feeds/posts/default?alt=rss')
      const expected = 'https://blog.example.com/feeds/posts/default?alt=rss'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should keep the feed fragment', () => {
      const value = new URL('https://morss.it/https:/www.example.com/feed#latest')
      const expected = 'https:/www.example.com/feed#latest'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should extract a feed on the www host', () => {
      const value = new URL('http://www.morss.it/https:/www.example.com/feed/')
      const expected = 'https:/www.example.com/feed/'

      expect(unwrapMorss(value)).toBe(expected)
    })
  })

  describe('options before the feed', () => {
    it('should extract a feed after one option', () => {
      const value = new URL(
        'https://www.morss.it/:proxy/https:/www.example.com/?page=backend&lang=fr',
      )
      const expected = 'https:/www.example.com/?page=backend&lang=fr'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should extract a feed after chained options', () => {
      const value = new URL(
        'https://morss.it/:clip:html/feed.example.com/digests/42SJJ9A6HY/feeder.rss',
      )
      const expected = 'http://feed.example.com/digests/42SJJ9A6HY/feeder.rss'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should extract a feed after an option with a value', () => {
      const value = new URL(
        'https://morss.it/:proxy:format=html:newest/https:/www.example.com/feed/',
      )
      const expected = 'https:/www.example.com/feed/'

      expect(unwrapMorss(value)).toBe(expected)
    })

    it('should return undefined for a page with an items selector', () => {
      const value = new URL(
        'https://morss.it/:items=%7C%7C*%5Bh3%5D/https:/www.example.com/-Francais-',
      )

      expect(unwrapMorss(value)).toBeUndefined()
    })

    it('should return undefined for a second option segment', () => {
      const value = new URL('https://morss.it/:proxy/:clip/https:/www.example.com/feed')

      expect(unwrapMorss(value)).toBeUndefined()
    })

    it('should return undefined for options without a feed', () => {
      const value = new URL('https://morss.it/:proxy/')

      expect(unwrapMorss(value)).toBeUndefined()
    })
  })

  describe('other hosts', () => {
    it('should return undefined for the shape on another host', () => {
      const value = new URL('https://example.org/https:/www.example.com/feed')

      expect(unwrapMorss(value)).toBeUndefined()
    })
  })

  describe('morss own pages', () => {
    it('should return undefined for the root', () => {
      const value = new URL('http://morss.it/')

      expect(unwrapMorss(value)).toBeUndefined()
    })

    it('should return undefined for the feed stylesheet', () => {
      const value = new URL('https://morss.it/sheet.xsl')

      expect(unwrapMorss(value)).toBeUndefined()
    })
  })
})
