import { describe, expect, it } from 'bun:test'
import { unwrapPodcastReady } from './podcastReady.js'

describe('unwrapPodcastReady', () => {
  it('should extract a percent-encoded feed', () => {
    const value = new URL(
      'http://www.podcastready.com/oneclick_bookmark.php?url=http%3A%2F%2Ffeeds.example.com%2Fescuchaespanol',
    )
    const expected = 'http://feeds.example.com/escuchaespanol'

    expect(unwrapPodcastReady(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL(
      'http://www.podcastready.com/oneclick_bookmark.php?url=http://example.com/rss',
    )
    const expected = 'http://example.com/rss'

    expect(unwrapPodcastReady(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'http://www.podcastready.com/oneclick_bookmark.php?url=http%253A%252F%252Fexample.com%252Frss',
    )
    const expected = 'http://example.com/rss'

    expect(unwrapPodcastReady(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'http://www.podcastready.com/OneClick_Bookmark.php?url=http%3A%2F%2Fexample.com%2Frss',
    )
    const expected = 'http://example.com/rss'

    expect(unwrapPodcastReady(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('http://www.podcastready.com/oneclick_bookmark.php?url=')

    expect(unwrapPodcastReady(value)).toBeUndefined()
  })

  it('should return undefined without a url', () => {
    const value = new URL('http://www.podcastready.com/oneclick_bookmark.php')

    expect(unwrapPodcastReady(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://www.podcastready.com/podcast_details.php?url=http%3A%2F%2Fexample.com%2Frss',
    )

    expect(unwrapPodcastReady(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://www.example.com/oneclick_bookmark.php?url=http%3A%2F%2Fexample.com%2Frss',
    )

    expect(unwrapPodcastReady(value)).toBeUndefined()
  })
})
