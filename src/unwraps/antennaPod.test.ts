import { describe, expect, it } from 'bun:test'
import { unwrapAntennaPod } from './antennaPod.js'

describe('unwrapAntennaPod', () => {
  it('should extract a raw feed and drop the title', () => {
    const value = new URL(
      'https://antennapod.org/deeplink/subscribe?url=https://example.com/@linuxprepper/feed.xml&title=linuxprepper',
    )
    const expected = 'https://example.com/@linuxprepper/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should extract a percent-encoded feed on the path with a trailing slash', () => {
    const value = new URL(
      'https://antennapod.org/deeplink/subscribe/?url=https%3A%2F%2Fexample.com%2Fblog%2F210337%2Frss&title=Sama+Africa+-+le+podcast+%21',
    )
    const expected = 'https://example.com/blog/210337/rss'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should extract a feed from a locale copy of the page', () => {
    const value = new URL(
      'https://antennapod.org/fr/deeplink/subscribe/?url=https://example.com/@lemegaphone/feed.xml',
    )
    const expected = 'https://example.com/@lemegaphone/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should extract a feed from a locale the site may add later', () => {
    const value = new URL(
      'https://antennapod.org/pt/deeplink/subscribe/?url=https://example.com/@lemegaphone/feed.xml',
    )
    const expected = 'https://example.com/@lemegaphone/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should extract a feed from a locale with a region', () => {
    const value = new URL(
      'https://antennapod.org/pt-br/deeplink/subscribe/?url=https://example.com/@lemegaphone/feed.xml',
    )
    const expected = 'https://example.com/@lemegaphone/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should extract a feed on the www host', () => {
    const value = new URL(
      'https://www.antennapod.org/deeplink/subscribe/?url=https://example.com/feed.xml',
    )
    const expected = 'https://example.com/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://antennapod.org/DE/DeepLink/Subscribe?url=https://example.com/feed.xml',
    )
    const expected = 'https://example.com/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'https://antennapod.org/deeplink/subscribe?url=https%253A%252F%252Fexample.com%252Ffeed.xml',
    )
    const expected = 'https://example.com/feed.xml'

    expect(unwrapAntennaPod(value)).toBe(expected)
  })

  it('should return undefined without the url param', () => {
    const value = new URL('https://antennapod.org/deeplink/subscribe/?title=linuxprepper')

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })

  it('should return undefined for an empty url param', () => {
    const value = new URL('https://antennapod.org/deeplink/subscribe/?url=')

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })

  it('should return undefined for another deep link of the site', () => {
    const value = new URL(
      'https://antennapod.org/deeplink/search/?query=https://example.com/feed.xml',
    )

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })

  it('should return undefined for a path past the subscribe page', () => {
    const value = new URL(
      'https://antennapod.org/deeplink/subscribe/extra?url=https://example.com/feed.xml',
    )

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })

  it('should return undefined for a prefix that is not a locale', () => {
    const value = new URL(
      'https://antennapod.org/blog/deeplink/subscribe/?url=https://example.com/feed.xml',
    )

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/deeplink/subscribe/?url=https://example.org/feed.xml',
    )

    expect(unwrapAntennaPod(value)).toBeUndefined()
  })
})
