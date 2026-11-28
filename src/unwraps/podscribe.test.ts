import { describe, expect, it } from 'bun:test'
import { unwrapPodscribe } from './podscribe.js'

describe('unwrapPodscribe', () => {
  it('should extract a target without a scheme from pscrb.fm', () => {
    const value = new URL(
      'https://pscrb.fm/rss/p/example.com/the_witch_wave/DRATCHAllEditFinal.mp3',
    )
    const expected = 'example.com/the_witch_wave/DRATCHAllEditFinal.mp3'

    expect(unwrapPodscribe(value)).toBe(expected)
  })

  it('should extract a target from verifi.podscribe.com and keep its query string', () => {
    const value = new URL(
      'https://verifi.podscribe.com/rss/p/example.com/secure/androidcentral/Android_Central_280324.mp3?dest-id=35189',
    )
    const expected = 'example.com/secure/androidcentral/Android_Central_280324.mp3?dest-id=35189'

    expect(unwrapPodscribe(value)).toBe(expected)
  })

  it('should extract a target with a scheme', () => {
    const value = new URL(
      'https://pscrb.fm/rss/p/http://example.com/u/1lzg0dn/f/Podsblitz_Episode36.mp3?v=1767707437',
    )
    const expected = 'http://example.com/u/1lzg0dn/f/Podsblitz_Episode36.mp3?v=1767707437'

    expect(unwrapPodscribe(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/example.com/secure/ESP8316344405.mp3?dest-id=4434203',
    )
    const expected =
      'dts.podtrac.com/redirect.mp3/example.com/secure/ESP8316344405.mp3?dest-id=4434203'

    expect(unwrapPodscribe(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://pscrb.fm/rss/p/')

    expect(unwrapPodscribe(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the hosts', () => {
    const value = new URL('https://pscrb.fm/rss/example.com/episode.mp3')

    expect(unwrapPodscribe(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/rss/p/example.org/episode.mp3')

    expect(unwrapPodscribe(value)).toBeUndefined()
  })
})
