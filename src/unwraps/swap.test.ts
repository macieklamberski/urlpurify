import { describe, expect, it } from 'bun:test'
import { unwrapSwap } from './swap.js'

describe('unwrapSwap', () => {
  it('should extract a target without a scheme and keep its query string', () => {
    const url = new URL(
      'https://tracking.swap.fm/track/fxUKVg2nSMaPSHLeKNKH/example.com/episodes/02c0ac21/audio/128/default.mp3?aid=rss_feed',
    )

    expect(unwrapSwap(url)).toBe(
      'https://example.com/episodes/02c0ac21/audio/128/default.mp3?aid=rss_feed',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://tracking.swap.fm/track/sblTq32fyWAjsHzze2LG/dts.podtrac.com/redirect.mp3/example.com/11709/Quanta_293_v1.mp3',
    )

    expect(unwrapSwap(url)).toBe(
      'https://dts.podtrac.com/redirect.mp3/example.com/11709/Quanta_293_v1.mp3',
    )
  })

  it('should extract a target from a staging host', () => {
    const url = new URL(
      'https://dev.swap.fm/track/966iG52chvJfjET9zmlc/staging.swap.fm/track/aTXXqoVB8c1nISJd2wpq/tracking-stage.swap.fm/track/gSUvXucPYh23u71igzxy/example.com/FPMN1074820307.mp3?updated=1753942550',
    )

    expect(unwrapSwap(url)).toBe(
      'https://staging.swap.fm/track/aTXXqoVB8c1nISJd2wpq/tracking-stage.swap.fm/track/gSUvXucPYh23u71igzxy/example.com/FPMN1074820307.mp3?updated=1753942550',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://tracking.swap.fm/track/fxUKVg2nSMaPSHLeKNKH/')

    expect(unwrapSwap(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://swap.fm/shows/fxUKVg2nSMaPSHLeKNKH/example.com/episode.mp3')

    expect(unwrapSwap(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/track/fxUKVg2nSMaPSHLeKNKH/example.org/episode.mp3')

    expect(unwrapSwap(url)).toBeUndefined()
  })
})
