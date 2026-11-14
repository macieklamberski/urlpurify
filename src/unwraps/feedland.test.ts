import { describe, expect, it } from 'bun:test'
import { unwrapFeedland } from './feedland.js'

describe('unwrapFeedland', () => {
  it('should extract a raw feed from the river param', () => {
    const value = new URL(
      'https://blue.feedland.org/?river=http://data.feedland.org/blue/feeds/@Komarnyckyj.xml',
    )
    const expected = 'http://data.feedland.org/blue/feeds/@Komarnyckyj.xml'

    expect(unwrapFeedland(value)).toBe(expected)
  })

  it('should keep the query of a raw feed', () => {
    const value = new URL(
      'https://feedland.org/?river=https://rss.example.com/?filter=from:andrewhickey.bsky.social',
    )
    const expected = 'https://rss.example.com/?filter=from:andrewhickey.bsky.social'

    expect(unwrapFeedland(value)).toBe(expected)
  })

  it('should decode a percent-encoded escape in the query of a raw feed', () => {
    const value = new URL(
      'https://feedland.com/?river=https://rss.example.com/?filter=from%3aandrewhickey.bsky.social',
    )
    const expected = 'https://rss.example.com/?filter=from:andrewhickey.bsky.social'

    expect(unwrapFeedland(value)).toBe(expected)
  })

  it('should decode a percent-encoded feed from the river param', () => {
    const value = new URL(
      'https://feedland.com/?river=http%3A%2F%2Fexample.org%2Fmisc%2Fartfeed.xml',
    )
    const expected = 'http://example.org/misc/artfeed.xml'

    expect(unwrapFeedland(value)).toBe(expected)
  })

  it('should extract a feed from the feedurl param', () => {
    const value = new URL(
      'https://feedland.com/?feedurl=http%3A%2F%2Fexample.org%2Fmisc%2Fartfeed.xml',
    )
    const expected = 'http://example.org/misc/artfeed.xml'

    expect(unwrapFeedland(value)).toBe(expected)
  })

  it('should return undefined for a reading list', () => {
    const value = new URL(
      'https://feedland.com/?readinglistnews=https%3A%2F%2Fwww.example.com%2Flinks%2Fblogroll.opml',
    )

    expect(unwrapFeedland(value)).toBeUndefined()
  })

  it('should return undefined when the river param is empty', () => {
    const value = new URL('https://feedland.org/?river=')

    expect(unwrapFeedland(value)).toBeUndefined()
  })

  it('should return undefined for the reading list api on another path', () => {
    const value = new URL(
      'https://feedland.org/getriverfromreadinglist?url=https://example.org/artshow.opml',
    )

    expect(unwrapFeedland(value)).toBeUndefined()
  })

  it('should return undefined for the river param on another host', () => {
    const value = new URL('https://example.com/?river=http://data.feedland.org/feeds/dave.xml')

    expect(unwrapFeedland(value)).toBeUndefined()
  })
})
