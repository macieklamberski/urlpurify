import { describe, expect, it } from 'bun:test'
import { unwrapLivedoorReader } from './livedoorReader.js'

describe('unwrapLivedoorReader', () => {
  describe('url param', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/?url=http%3A%2F%2Fsitagiya.example.com%2FRSS%2F',
      )
      const expected = 'http://sitagiya.example.com/RSS/'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should keep the query of a percent-encoded feed', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/?url=http%3A%2F%2Fchillstigma.example.com%2F%3Fxml',
      )
      const expected = 'http://chillstigma.example.com/?xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/?url=http%253A%252F%252Fexample.com%252Frss.xml',
      )
      const expected = 'http://example.com/rss.xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('http://reader.livedoor.com/Subscribe/?url=http://example.com/rss.xml')
      const expected = 'http://example.com/rss.xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should return undefined for an empty url param', () => {
      const value = new URL('http://reader.livedoor.com/subscribe/?url=')

      expect(unwrapLivedoorReader(value)).toBeUndefined()
    })

    it('should return undefined without a carrier', () => {
      const value = new URL('http://reader.livedoor.com/subscribe/')

      expect(unwrapLivedoorReader(value)).toBeUndefined()
    })

    it('should drop the link fragment', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/?url=http://example.com/rss.xml#comments',
      )
      const expected = 'http://example.com/rss.xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })
  })

  describe('feed path', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/http://minamuranomad.example.com/',
      )
      const expected = 'http://minamuranomad.example.com/'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should keep the query of a raw feed', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/http://aminamura.example.com/?xml',
      )
      const expected = 'http://aminamura.example.com/?xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should extract a feed with a single-slash scheme', () => {
      const value = new URL('http://reader.livedoor.com/subscribe/http:/www.example.com/feed/rss')
      const expected = 'http:/www.example.com/feed/rss'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('http://reader.livedoor.com/SUBSCRIBE/http://example.com/rss.xml')
      const expected = 'http://example.com/rss.xml'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })

    it('should return undefined for a feed path without a scheme', () => {
      const value = new URL('http://reader.livedoor.com/subscribe/example.com/rss.xml')

      expect(unwrapLivedoorReader(value)).toBeUndefined()
    })

    it('should return undefined for a non-http feed', () => {
      const value = new URL('http://reader.livedoor.com/subscribe/ftp://example.com/rss.xml')

      expect(unwrapLivedoorReader(value)).toBeUndefined()
    })

    it('should keep the link fragment', () => {
      const value = new URL(
        'http://reader.livedoor.com/subscribe/http://example.com/rss.xml#comments',
      )
      const expected = 'http://example.com/rss.xml#comments'

      expect(unwrapLivedoorReader(value)).toBe(expected)
    })
  })

  it('should return undefined for the subscribe path on another host', () => {
    const value = new URL('http://reader.example.com/subscribe/?url=http://example.com/rss.xml')

    expect(unwrapLivedoorReader(value)).toBeUndefined()
  })

  it('should return undefined for the reader page', () => {
    const value = new URL('http://reader.livedoor.com/reader/?url=http://example.com/rss.xml')

    expect(unwrapLivedoorReader(value)).toBeUndefined()
  })

  it('should return undefined for the feed path under another path', () => {
    const value = new URL('http://reader.livedoor.com/reader/subscribe/http://example.com/rss.xml')

    expect(unwrapLivedoorReader(value)).toBeUndefined()
  })
})
