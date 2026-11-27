import { describe, expect, it } from 'bun:test'
import { unwrapBloglines } from './bloglines.js'

describe('unwrapBloglines', () => {
  describe('raw feed in the path', () => {
    it('should extract an http feed', () => {
      const value = new URL('http://www.bloglines.com/sub/http://feeds.example.com/michperu')
      const expected = 'http://feeds.example.com/michperu'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should extract an https feed', () => {
      const value = new URL(
        'http://www.bloglines.com/sub/https://www.example.com/rss/section/1111181',
      )
      const expected = 'https://www.example.com/rss/section/1111181'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should keep the feed query', () => {
      const value = new URL('http://www.bloglines.com/sub/http://example.com/tag/probate/rss?l=20')
      const expected = 'http://example.com/tag/probate/rss?l=20'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should extract a feed with a single slash after its scheme', () => {
      const value = new URL('http://www.bloglines.com/sub/http:/scottf.example.com/feed/')
      const expected = 'http:/scottf.example.com/feed/'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should extract a feed on the bare host', () => {
      const value = new URL('http://bloglines.com/sub/http://feeds.example.com/michperu')
      const expected = 'http://feeds.example.com/michperu'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should keep the link fragment', () => {
      const value = new URL(
        'http://www.bloglines.com/sub/http://feeds.example.com/michperu#comments',
      )
      const expected = 'http://feeds.example.com/michperu#comments'

      expect(unwrapBloglines(value)).toBe(expected)
    })
  })

  describe('encoded feed in the path', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://www.bloglines.com/sub/http%3A%2F%2Fexample.com%2F2014%2F05%2F11%2Fwe-need-your-vote%2F',
      )
      const expected = 'http://example.com/2014/05/11/we-need-your-vote/'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should extract a feed with only its scheme colon encoded', () => {
      const value = new URL('http://www.bloglines.com/sub/http%3Afun.example.com/famed/rss/k-5.rss')
      const expected = 'http:fun.example.com/famed/rss/k-5.rss'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should extract a twice-encoded feed', () => {
      const value = new URL('http://www.bloglines.com/sub/http%253A%252F%252Fexample.com%252Ffeed')
      const expected = 'http://example.com/feed'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should return undefined for an encoded feed without a host', () => {
      const value = new URL('http://www.bloglines.com/sub/https%3A%2F%2F')

      expect(unwrapBloglines(value)).toBeUndefined()
    })

    it('should drop the link fragment', () => {
      const value = new URL('http://www.bloglines.com/sub/http%3A%2F%2Fexample.com%2Ffeed#comments')
      const expected = 'http://example.com/feed'

      expect(unwrapBloglines(value)).toBe(expected)
    })
  })

  describe('url param', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://www.bloglines.com/sub/?url=http%3A%2F%2Fsitagiya.example.jp%2FRSS%2F',
      )
      const expected = 'http://sitagiya.example.jp/RSS/'

      expect(unwrapBloglines(value)).toBe(expected)
    })

    it('should return undefined without a carrier', () => {
      const value = new URL('http://www.bloglines.com/sub/')

      expect(unwrapBloglines(value)).toBeUndefined()
    })

    it('should drop the link fragment', () => {
      const value = new URL(
        'http://www.bloglines.com/sub/?url=http%3A%2F%2Fexample.com%2Ffeed#comments',
      )
      const expected = 'http://example.com/feed'

      expect(unwrapBloglines(value)).toBe(expected)
    })
  })

  describe('controls', () => {
    it('should return undefined for a path without a feed', () => {
      const value = new URL('http://www.bloglines.com/sub/12345')

      expect(unwrapBloglines(value)).toBeUndefined()
    })

    it('should return undefined for another path', () => {
      const value = new URL(
        'http://www.bloglines.com/myblogs_display?sub=64261837&url=http://example.com/feed',
      )

      expect(unwrapBloglines(value)).toBeUndefined()
    })

    it('should return undefined for the shape on another host', () => {
      const value = new URL('http://www.example.com/sub/http://feeds.example.com/michperu')

      expect(unwrapBloglines(value)).toBeUndefined()
    })
  })
})
