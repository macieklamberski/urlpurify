import { describe, expect, it } from 'bun:test'
import { unwrapPodcastAddict } from './podcastAddict.js'

describe('unwrapPodcastAddict', () => {
  it('should extract a percent-encoded feed', () => {
    const value = new URL(
      'https://podcastaddict.com/feed/https%3A%2F%2Fexample.com%2Frss%2Fuser%2Fckbri7xe25f7j0918ybxuvpgs',
    )
    const expected = 'https://example.com/rss/user/ckbri7xe25f7j0918ybxuvpgs'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should extract a feed encoded in lowercase', () => {
    const value = new URL(
      'https://podcastaddict.com/feed/https%3a%2f%2fexample.com%2f2e7ceeef-1889-45ff-a90f-eff7988fb63a',
    )
    const expected = 'https://example.com/2e7ceeef-1889-45ff-a90f-eff7988fb63a'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL('https://podcastaddict.com/feed/https://example.com/2342683.rss')
    const expected = 'https://example.com/2342683.rss'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should keep the query string of a raw feed', () => {
    const value = new URL(
      'https://podcastaddict.com/feed/https://example.com/podcast.php?id=510161',
    )
    const expected = 'https://example.com/podcast.php?id=510161'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed', () => {
    const value = new URL(
      'https://podcastaddict.com/feed/https%253A%252F%252Fexample.com%252Fs%252F27ff739c%252Fpodcast%252Frss',
    )
    const expected = 'https://example.com/s/27ff739c/podcast/rss'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://podcastaddict.com/Feed/https%3A%2F%2Fexample.com%2Fs%2F27ff739c%2Fpodcast%2Frss',
    )
    const expected = 'https://example.com/s/27ff739c/podcast/rss'

    expect(unwrapPodcastAddict(value)).toBe(expected)
  })

  it('should return undefined for a non-http feed', () => {
    const value = new URL('https://podcastaddict.com/feed/javascript%3Aalert(1)')

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })

  it('should return undefined for an empty feed', () => {
    const value = new URL('https://podcastaddict.com/feed/')

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })

  it('should return undefined for an episode link on the root', () => {
    const value = new URL(
      'https://podcastaddict.com/?id=https%3A%2F%2Fexample.com%2Fs%2Fda26d510%2Fpodcast%2Fplay%2F119719042%2Fhttps%253A%252F%252Fexample.org%252Fstaging%252F2026-4-9%252F423793238-44100-2-d53aaa846bdf5.mp3&podcastId=4545372',
    )

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })

  it('should return undefined for an episode page', () => {
    const value = new URL(
      'https://podcastaddict.com/episode/https%3A%2F%2Fexample.com%2Fep%2Faudio.mp3&podcastId=5874710',
    )

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/feed/https%3A%2F%2Fexample.org%2Frss')

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplepodcastaddict.com/feed/https%3A%2F%2Fexample.org%2Frss')

    expect(unwrapPodcastAddict(value)).toBeUndefined()
  })
})
