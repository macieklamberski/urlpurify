import { describe, expect, it } from 'bun:test'
import { unwrapPodcorn } from './podcorn.js'

describe('unwrapPodcorn', () => {
  it('should extract a target without a scheme and keep its query string', () => {
    const value = new URL(
      'https://pdcn.co/e/example.com/audio/7976124/7976124_2026-02-13-213724.128.mp3?rssID=4772',
    )
    const expected = 'example.com/audio/7976124/7976124_2026-02-13-213724.128.mp3?rssID=4772'

    expect(unwrapPodcorn(value)).toBe(expected)
  })

  it('should extract a target with a scheme', () => {
    const value = new URL('https://pdcn.co/e/http://example.com/ep/yDo40T3sg/media/z1pjSfE4a.mp3')
    const expected = 'http://example.com/ep/yDo40T3sg/media/z1pjSfE4a.mp3'

    expect(unwrapPodcorn(value)).toBe(expected)
  })

  it('should skip an empty segment after the prefix', () => {
    const value = new URL('https://pdcn.co/e//example.com/datingwomenradioshow/DWP556.mp3')
    const expected = 'example.com/datingwomenradioshow/DWP556.mp3'

    expect(unwrapPodcorn(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://pdcn.co/e/dts.podtrac.com/redirect.mp3/example.com/broadway/20260628-br-twob.mp3',
    )
    const expected = 'dts.podtrac.com/redirect.mp3/example.com/broadway/20260628-br-twob.mp3'

    expect(unwrapPodcorn(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://pdcn.co/e/')

    expect(unwrapPodcorn(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://pdcn.co/about/example.com/episode.mp3')

    expect(unwrapPodcorn(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/e/example.org/episode.mp3')

    expect(unwrapPodcorn(value)).toBeUndefined()
  })
})
