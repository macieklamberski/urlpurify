import { describe, expect, it } from 'bun:test'
import { unwrapRssBoardValidator } from './rssBoardValidator.js'

describe('unwrapRssBoardValidator', () => {
  it('should extract a fully encoded feed', () => {
    const value = new URL(
      'https://www.rssboard.org/rss-validator/check.cgi?url=https%3A%2F%2Fexample.com%2Frss%2F2921',
    )
    const expected = 'https://example.com/rss/2921'

    expect(unwrapRssBoardValidator(value)).toBe(expected)
  })

  it('should extract a feed with only the scheme colon encoded', () => {
    const value = new URL(
      'http://www.rssboard.org/rss-validator/check.cgi?url=http%3A//example.com/feeds.xml',
    )
    const expected = 'http://example.com/feeds.xml'

    expect(unwrapRssBoardValidator(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed', () => {
    const value = new URL(
      'https://www.rssboard.org/rss-validator/check.cgi?url=https%253A%252F%252Fexample.com%252Ffeed%252F',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapRssBoardValidator(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.rssboard.org/RSS-Validator/Check.cgi?url=https%3A%2F%2Fexample.com%2Ffeed%2F',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapRssBoardValidator(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.rssboard.org/rss-validator/check.cgi')

    expect(unwrapRssBoardValidator(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.rssboard.org/rss-validator/check.cgi?url=')

    expect(unwrapRssBoardValidator(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.rssboard.org/rss-specification?url=https%3A%2F%2Fexample.com%2Ffeed%2F',
    )

    expect(unwrapRssBoardValidator(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://example.org/archive/www.rssboard.org/rss-validator/check.cgi?url=https%3A%2F%2Fexample.com%2Ffeed%2F',
    )

    expect(unwrapRssBoardValidator(value)).toBeUndefined()
  })
})
