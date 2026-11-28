import { describe, expect, it } from 'bun:test'
import { unwrapPodroll } from './podroll.js'

describe('unwrapPodroll', () => {
  it('should extract a target after the show id', () => {
    const value = new URL('https://pdrl.fm/e800c2/example.com/FGP7915113410.mp3')
    const expected = 'https://example.com/FGP7915113410.mp3'

    expect(unwrapPodroll(value)).toBe(expected)
  })

  it('should extract a target on the rss host', () => {
    const value = new URL('https://rss.pdrl.fm/ccb7c9/example.com/episode.mp3')
    const expected = 'https://example.com/episode.mp3'

    expect(unwrapPodroll(value)).toBe(expected)
  })

  it('should keep the query string of the target', () => {
    const value = new URL(
      'https://pdrl.fm/37b23c/example.com/episodes/47001e9d-028e-4b92-9d0d-9ba23e90c63b.mp3?rss_browser=BAhJIgtDaHJvbWUGOgZFVA%3D%3D',
    )
    const expected =
      'https://example.com/episodes/47001e9d-028e-4b92-9d0d-9ba23e90c63b.mp3?rss_browser=BAhJIgtDaHJvbWUGOgZFVA%3D%3D'

    expect(unwrapPodroll(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://pdrl.fm/5d66a1/pscrb.fm/rss/p/mgln.ai/e/1385/example.com/episode.mp3',
    )
    const expected = 'https://pscrb.fm/rss/p/mgln.ai/e/1385/example.com/episode.mp3'

    expect(unwrapPodroll(value)).toBe(expected)
  })

  it('should return undefined when the show id has no target', () => {
    const value = new URL('https://pdrl.fm/e800c2/')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://pdrl.fm/about/example.com/episode.mp3')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/e800c2/example.org/episode.mp3')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should return undefined for an id longer than 6 characters', () => {
    const value = new URL('https://pdrl.fm/e800c2a/example.com/episode.mp3')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should return undefined for a target with no show id', () => {
    const value = new URL('https://pdrl.fm/ab.cde/episode.mp3')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should return undefined for an id below another segment', () => {
    const value = new URL('https://pdrl.fm/a/e800c2/example.com/episode.mp3')

    expect(unwrapPodroll(value)).toBeUndefined()
  })

  it('should keep the http scheme of the prefix on a target without one', () => {
    const value = new URL('http://pdrl.fm/e800c2/example.com/FGP7915113410.mp3')
    const expected = 'http://example.com/FGP7915113410.mp3'

    expect(unwrapPodroll(value)).toBe(expected)
  })
})
