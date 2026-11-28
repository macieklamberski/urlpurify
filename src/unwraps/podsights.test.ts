import { describe, expect, it } from 'bun:test'
import { unwrapPodsights } from './podsights.js'

describe('unwrapPodsights', () => {
  it('should extract a target without a scheme and keep its query string', () => {
    const value = new URL('https://pdst.fm/e/example.com/WSJ9288143088.mp3?updated=1762985328')
    const expected = 'https://example.com/WSJ9288143088.mp3?updated=1762985328'

    expect(unwrapPodsights(value)).toBe(expected)
  })

  it('should extract a target with a scheme', () => {
    const value = new URL(
      'https://pdst.fm/e/http://example.com/theshortcoat/381-speeding-to-med-school.mp3',
    )
    const expected = 'http://example.com/theshortcoat/381-speeding-to-med-school.mp3'

    expect(unwrapPodsights(value)).toBe(expected)
  })

  it('should extract a target from the Spotify prefix host', () => {
    const value = new URL(
      'https://prfx.byspotify.com/e/example.com/secure/birthhour/ashlie_holladay_-_7126_5.18PM.mp3',
    )
    const expected = 'https://example.com/secure/birthhour/ashlie_holladay_-_7126_5.18PM.mp3'

    expect(unwrapPodsights(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'http://pdst.fm/e/dts.podtrac.com/redirect.mp3/example.com/Podcasts/Gardenerd_06-18-20.mp3',
    )
    const expected =
      'http://dts.podtrac.com/redirect.mp3/example.com/Podcasts/Gardenerd_06-18-20.mp3'

    expect(unwrapPodsights(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://pdst.fm/e/')

    expect(unwrapPodsights(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://pdst.fm/go.php?s=55&u=https://example.com/page')

    expect(unwrapPodsights(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/e/example.org/episode.mp3')

    expect(unwrapPodsights(value)).toBeUndefined()
  })
})
