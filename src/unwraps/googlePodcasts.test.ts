import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapGooglePodcasts } from './googlePodcasts.js'

describe('unwrapGooglePodcasts', () => {
  it('should give https to a show feed without a scheme', () => {
    const value = 'https://podcasts.google.com/feed/d3d3LmV4YW1wbGUuY29tL3Jzcw'
    const expected = 'https://www.example.com/rss'

    expect(purifyUrl(value, { unwrappers: [unwrapGooglePodcasts] })).toBe(expected)
  })

  it('should keep a raw plus in a query feed', () => {
    const value = new URL(
      'https://www.google.com/podcasts?feed=aHR0cHM6Ly9leGFtcGxlLm9yZy9hP2I9fn5+Pg==',
    )
    const expected = 'https://example.org/a?b=~~~>'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode an unpadded base64 feed from www.google.com/podcasts', () => {
    const value = new URL('https://www.google.com/podcasts?feed=aHR0cDovL2V4YW1wbGUuY29tL3Jzcw')
    const expected = 'http://example.com/rss'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a query feed with an encoded space inside it', () => {
    const value = new URL(
      'https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy9lZT%20EzODhjL3BvZGNhc3QvcnNz',
    )
    const expected = 'https://anchor.fm/s/ee1388c/podcast/rss'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed padded with percent-encoded equals signs', () => {
    const value = new URL(
      'https://www.google.com/podcasts?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVkLnhtbA%3D%3D',
    )
    const expected = 'https://example.com/feed.xml'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed padded with a raw equals sign', () => {
    const value = new URL(
      'https://www.google.com/podcasts?feed=aHR0cDovL2V4YW1wbGUuY29tL2ZlZWRzL3BvZGNhc3Q=',
    )
    const expected = 'http://example.com/feeds/podcast'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from google.com/podcasts without www', () => {
    const value = new URL('https://google.com/podcasts?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from the podcasts.google.com root', () => {
    const value = new URL(
      'https://podcasts.google.com/?feed=aHR0cDovL2V4YW1wbGUuY29tL2ZlZWRzL3BvZGNhc3Q%3D',
    )
    const expected = 'http://example.com/feeds/podcast'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a base64url feed holding a query', () => {
    const value = new URL(
      'https://podcasts.google.com/?feed=aHR0cHM6Ly9leGFtcGxlLm9yZy9yc3MvcG9kY2FzdC5waHA_aWQ9NTEwMTYx',
    )
    const expected = 'https://example.org/rss/podcast.php?id=510161'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed with app params beside it', () => {
    const value = new URL(
      'https://podcasts.google.com/?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk&sa=X&ved=2ahUKEwiVzq2bmrTmAhXPpFkKHXpQBvAQjrkEegQIARAS&hl=en&ep=14',
    )
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode the show feed of an episode link with a query feed', () => {
    const value = new URL(
      'https://podcasts.google.com/?feed=aHR0cDovL2V4YW1wbGUuY29tL3VzZXJzL3NvdW5kY2xvdWQ6dXNlcnM6MzM1NTUzOTA4L3NvdW5kcy5yc3M&episode=dGFnOnNvdW5kY2xvdWQsMjAxMDp0cmFja3MvNjIyMzEzMjk1&hl=en&ep=6',
    )
    const expected = 'http://example.com/users/soundcloud:users:335553908/sounds.rss'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from the show page path', () => {
    const value = new URL('https://podcasts.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from the show page path with a trailing encoded space', () => {
    const value = new URL(
      'https://podcasts.google.com/feed/aHR0cHM6Ly9tYW5hZ2Uyd2luLmxpYnN5bi5jb20vcnNz%20',
    )
    const expected = 'https://manage2win.libsyn.com/rss'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a padded feed from the show page path with app params', () => {
    const value = new URL(
      'https://podcasts.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVkL21wMw==?sa=X&ved=2ahUKEwiVzq2bmrTmAhXPpFkKHXpQBvAQjrkEegQIARAS',
    )
    const expected = 'https://example.com/feed/mp3'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed padded with a percent-encoded equals sign in the path', () => {
    const value = new URL(
      'https://podcasts.google.com/feed/aHR0cDovL2V4YW1wbGUuY29tL2ZlZWRzL3BvZGNhc3Q%3D',
    )
    const expected = 'http://example.com/feeds/podcast'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from the show page path under an account prefix', () => {
    const value = new URL('https://podcasts.google.com/u/1/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode a feed from the show page path with a trailing slash', () => {
    const value = new URL('https://podcasts.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk/')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should decode the show feed of an episode page path', () => {
    const value = new URL(
      'https://podcasts.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk/episode/dGFnOnNvdW5kY2xvdWQsMjAxMDp0cmFja3MvNjIyMzEzMjk1?sa=X&ved=0CAUQkfYCahcKEwiA1q2bmrTmAhUAAAAAHQAAAAAQAQ',
    )
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should return undefined for an episode page path without an id', () => {
    const value = new URL(
      'https://podcasts.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk/episode/',
    )

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for the show page path on www.google.com', () => {
    const value = new URL('https://www.google.com/feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should decode a feed from subscribe-by-rss-feed', () => {
    const value = new URL(
      'https://podcasts.google.com/subscribe-by-rss-feed?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVkL21wMw',
    )
    const expected = 'https://example.com/feed/mp3'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.google.com/Podcasts?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should match the show path in any case', () => {
    const value = new URL('https://podcasts.google.com/Feed/aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')
    const expected = 'https://example.com/feed'

    expect(unwrapGooglePodcasts(value)).toBe(expected)
  })

  it('should return undefined for a feed with text glued after its base64', () => {
    const value = new URL('https://www.google.com/podcasts?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk--')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http feed', () => {
    const value = 'https://podcasts.google.com/?feed=amF2YXNjcmlwdDphbGVydCgxKQ%3D%3D'

    expect(purifyUrl(value, { unwrappers: [unwrapGooglePodcasts] })).toBe(value)
  })

  it('should return undefined for a feed that is not base64', () => {
    const value = new URL('https://podcasts.google.com/?feed=%25%25%25')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for a missing feed', () => {
    const value = new URL('https://podcasts.google.com/?hl=en')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for an empty feed', () => {
    const value = new URL('https://www.google.com/podcasts?feed=')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for another path on podcasts.google.com', () => {
    const value = new URL(
      'https://podcasts.google.com/search?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk',
    )

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for the root path on www.google.com', () => {
    const value = new URL('https://www.google.com/?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/podcasts?feed=aHR0cHM6Ly9leGFtcGxlLmNvbS9mZWVk')

    expect(unwrapGooglePodcasts(value)).toBeUndefined()
  })
})
