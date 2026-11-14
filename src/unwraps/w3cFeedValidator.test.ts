import { describe, expect, it } from 'bun:test'
import { unwrapW3cFeedValidator } from './w3cFeedValidator.js'

describe('unwrapW3cFeedValidator', () => {
  it('should extract a feed with an encoded scheme', () => {
    const value = new URL(
      'http://validator.w3.org/feed/check.cgi?url=https%3A//chaerephon.e-monsite.com/medias/files/news.xml',
    )
    const expected = 'https://chaerephon.e-monsite.com/medias/files/news.xml'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should decode a fully percent-encoded feed', () => {
    const value = new URL(
      'https://validator.w3.org/feed/check.cgi?url=http%3A%2F%2Flinuxundich.de%2Ffeed',
    )
    const expected = 'http://linuxundich.de/feed'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL(
      'https://validator.w3.org/feed/check.cgi?url=https://example.com/feeds/all.rss.xml',
    )
    const expected = 'https://example.com/feeds/all.rss.xml'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should decode a raw scheme with encoded slashes in the path', () => {
    const value = new URL(
      'https://validator.w3.org/feed/check.cgi?url=https://kopi.cloud%2Ffeed%2Fblog.atom',
    )
    const expected = 'https://kopi.cloud/feed/blog.atom'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'https://validator.w3.org/feed/check.cgi?url=http%253A%252F%252Flinuxundich.de%252Ffeed',
    )
    const expected = 'http://linuxundich.de/feed'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should drop the line anchor of the report', () => {
    const value = new URL(
      'http://validator.w3.org/feed/check.cgi?url=http%3A%2F%2Ffeeds.feedburner.com%2FTheaterHopper#l618',
    )
    const expected = 'http://feeds.feedburner.com/TheaterHopper'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://validator.w3.org/Feed/Check.cgi?url=http%3A%2F%2Flinuxundich.de%2Ffeed',
    )
    const expected = 'http://linuxundich.de/feed'

    expect(unwrapW3cFeedValidator(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://validator.w3.org/feed/check.cgi')

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://validator.w3.org/feed/check.cgi?url=')

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined for the markup validator', () => {
    const value = new URL('http://validator.w3.org/check?uri=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined for the nu validator', () => {
    const value = new URL('https://validator.w3.org/nu/?doc=https%3A%2F%2Fexample.com%2F')

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined for the feed validator landing page', () => {
    const value = new URL('https://validator.w3.org/feed/?url=https://example.com/feed')

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined for the url param on another host', () => {
    const value = new URL(
      'https://example.com/feed/check.cgi?url=http%3A%2F%2Flinuxundich.de%2Ffeed',
    )

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplevalidator.w3.org/feed/check.cgi?url=http%3A%2F%2Flinuxundich.de%2Ffeed',
    )

    expect(unwrapW3cFeedValidator(value)).toBeUndefined()
  })
})
