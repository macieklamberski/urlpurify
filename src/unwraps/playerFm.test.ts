import { describe, expect, it } from 'bun:test'
import { unwrapPlayerFm } from './playerFm.js'

describe('unwrapPlayerFm', () => {
  it('should extract the feed from the importer', () => {
    const value = new URL(
      'https://player.fm/importer/feed?url=https%3A%2F%2Fexample.com%2F%40CANON_AND_CHAOS%2Ffeed.xml',
    )
    const expected = 'https://example.com/@CANON_AND_CHAOS/feed.xml'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should extract a feed without a scheme from the importer', () => {
    const value = new URL('https://player.fm/importer/feed?url=www.example.com%2Fpodcasts%2F10.xml')
    const expected = 'www.example.com/podcasts/10.xml'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should extract an unencoded feed from the subscribe link', () => {
    const value = new URL(
      'https://player.fm/subscribe?id=https://example.com/public/shows/5ad89f290086f45a5153bd09',
    )
    const expected = 'https://example.com/public/shows/5ad89f290086f45a5153bd09'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should extract an encoded feed from the subscribe link', () => {
    const value = new URL(
      'https://player.fm/subscribe?id=https%3A%2F%2Fexample.com%2F%40wiewatbewaart%2Ffeed.xml',
    )
    const expected = 'https://example.com/@wiewatbewaart/feed.xml'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed', () => {
    const value = new URL(
      'https://player.fm/importer/feed?url=https%253A%252F%252Fexample.com%252Ffeed.xml',
    )
    const expected = 'https://example.com/feed.xml'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://player.fm/Subscribe?id=https%3A%2F%2Fexample.com%2Ffeed.xml')
    const expected = 'https://example.com/feed.xml'

    expect(unwrapPlayerFm(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://player.fm/importer/feed')

    expect(unwrapPlayerFm(value)).toBeUndefined()
  })

  it('should return undefined when the id param is empty', () => {
    const value = new URL('https://player.fm/subscribe?id=')

    expect(unwrapPlayerFm(value)).toBeUndefined()
  })

  it('should return undefined for the url param on the subscribe link', () => {
    const value = new URL('https://player.fm/subscribe?url=https%3A%2F%2Fexample.com%2Ffeed.xml')

    expect(unwrapPlayerFm(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://player.fm/importer?url=https%3A%2F%2Fexample.com%2Ffeed.xml')

    expect(unwrapPlayerFm(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://example.com/importer/feed?url=https%3A%2F%2Fexample.org%2Ffeed.xml',
    )

    expect(unwrapPlayerFm(value)).toBeUndefined()
  })
})
