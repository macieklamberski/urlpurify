import { describe, expect, it } from 'bun:test'
import { unwrapFeedValidator } from './feedValidator.js'

describe('unwrapFeedValidator', () => {
  describe('feedvalidator.org', () => {
    it('should extract a percent-encoded feed from check.cgi', () => {
      const value = new URL(
        'http://www.feedvalidator.org/check.cgi?url=https%3A%2F%2Fexample.com%2Frss%2F%3Fcat%3D0',
      )
      const expected = 'https://example.com/rss/?cat=0'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should extract a raw feed from check', () => {
      const value = new URL('http://feedvalidator.org/check?url=http://music.example.com/rss.xml')
      const expected = 'http://music.example.com/rss.xml'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should extract a feed with only its scheme colon encoded', () => {
      const value = new URL(
        'http://feedvalidator.org/check.cgi?url=http%3A//www.example.com/teaching/Praktika/2009ws/rnp/rss.xml',
      )
      const expected = 'http://www.example.com/teaching/Praktika/2009ws/rnp/rss.xml'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'https://feedvalidator.org/check.cgi?url=https%253A%252F%252Fexample.com%252Ffeed%252F',
      )
      const expected = 'https://example.com/feed/'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('https://feedvalidator.org/Check.CGI?url=https://example.com/feed/')
      const expected = 'https://example.com/feed/'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should return undefined without a carrier', () => {
      const value = new URL('https://www.feedvalidator.org/check.cgi')

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })

    it('should return undefined for an empty carrier', () => {
      const value = new URL('https://www.feedvalidator.org/check.cgi?url=')

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })

    it('should return undefined for another path', () => {
      const value = new URL('https://www.feedvalidator.org/docs/?url=https://example.com/feed/')

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })
  })

  describe('atomenabled.org copy', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'http://www.atomenabled.org/feedvalidator/check.cgi?url=https://www.example.de/projekte/tstg/blog/atom.xml',
      )
      const expected = 'https://www.example.de/projekte/tstg/blog/atom.xml'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should return undefined for check.cgi outside the validator folder', () => {
      const value = new URL('http://www.atomenabled.org/check.cgi?url=https://example.com/atom.xml')

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })
  })

  describe('feeds.archive.org copy', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'http://feeds.archive.org/validator/check?url=http://www.example.com/rss/',
      )
      const expected = 'http://www.example.com/rss/'

      expect(unwrapFeedValidator(value)).toBe(expected)
    })

    it('should return undefined for the validator docs', () => {
      const value = new URL(
        'http://feeds.archive.org/validator/docs/howto/MovableType.html?url=http://example.com/',
      )

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })
  })

  describe('another host', () => {
    it('should return undefined for the shape on another host', () => {
      const value = new URL('https://example.com/check.cgi?url=https://example.com/feed/')

      expect(unwrapFeedValidator(value)).toBeUndefined()
    })
  })
})
