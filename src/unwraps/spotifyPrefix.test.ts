import { describe, expect, it } from 'bun:test'
import { unwrapSpotifyPrefix } from './spotifyPrefix.js'

describe('unwrapSpotifyPrefix', () => {
  it('should extract a target without a scheme', () => {
    const url = new URL(
      'https://prfx.byspotify.com/e/example.com/secure/birthhour/ashlie_holladay_-_7126_5.18PM.mp3',
    )

    expect(unwrapSpotifyPrefix(url)).toBe(
      'https://example.com/secure/birthhour/ashlie_holladay_-_7126_5.18PM.mp3',
    )
  })

  it('should extract a target with a scheme', () => {
    const url = new URL(
      'https://prfx.byspotify.com/e/https://example.com/mf/web/7mkrnpmwvzau6c3j/362final.mp3',
    )

    expect(unwrapSpotifyPrefix(url)).toBe(
      'https://example.com/mf/web/7mkrnpmwvzau6c3j/362final.mp3',
    )
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://prfx.byspotify.com/e/example.com/SIXMSB5151298274.mp3?updated=1776035612',
    )

    expect(unwrapSpotifyPrefix(url)).toBe(
      'https://example.com/SIXMSB5151298274.mp3?updated=1776035612',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://prfx.byspotify.com/e/')

    expect(unwrapSpotifyPrefix(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://prfx.byspotify.com/example.com/episode.mp3')

    expect(unwrapSpotifyPrefix(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/e/example.org/episode.mp3')

    expect(unwrapSpotifyPrefix(url)).toBeUndefined()
  })
})
