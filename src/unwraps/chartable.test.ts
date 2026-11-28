import { describe, expect, it } from 'bun:test'
import { unwrapChartable } from './chartable.js'

describe('unwrapChartable', () => {
  it('should extract a target without a scheme from chrt.fm', () => {
    const value = new URL('https://chrt.fm/track/6DA3GA/example.com/artofcomposing/13_AOC_013.mp3')
    const expected = 'example.com/artofcomposing/13_AOC_013.mp3'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should extract a target without a scheme from chtbl.com', () => {
    const value = new URL(
      'https://chtbl.com/track/CF4834/example.com/static/554a6e7e/t/623f603b/1648320630371/Episode+110.mp3',
    )
    const expected = 'example.com/static/554a6e7e/t/623f603b/1648320630371/Episode+110.mp3'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should keep the scheme and query string of a target', () => {
    const value = new URL(
      'https://chrt.fm/track/G23FB8/http://example.com/574473/audio--418670.mp3?v=1657042933',
    )
    const expected = 'http://example.com/574473/audio--418670.mp3?v=1657042933'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should skip an empty segment after the id', () => {
    const value = new URL(
      'https://chtbl.com/track/6538//example.com/forcedn/bordersofsleep/SBS_EP0049.mp3',
    )
    const expected = 'example.com/forcedn/bordersofsleep/SBS_EP0049.mp3'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://chtbl.com/track/3G835/podtrac.com/pts/redirect.mp3/example.com/d/clips/audio.mp3?utm_source=Podcast',
    )
    const expected = 'podtrac.com/pts/redirect.mp3/example.com/d/clips/audio.mp3?utm_source=Podcast'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should extract a target with a scheme when the id is missing', () => {
    const value = new URL(
      'https://chtbl.com/track/http://example.com/stream/1075446052-free-picks.mp3',
    )
    const expected = 'http://example.com/stream/1075446052-free-picks.mp3'

    expect(unwrapChartable(value)).toBe(expected)
  })

  it('should return undefined for a target without a scheme when the id is missing', () => {
    const value = new URL('https://chtbl.com/track/example.com/stream/1075446052-free-picks.mp3')

    expect(unwrapChartable(value)).toBeUndefined()
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://chrt.fm/track/6DA3GA/')

    expect(unwrapChartable(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the hosts', () => {
    const value = new URL('https://chtbl.com/podcasts/6DA3GA/example.com/episode.mp3')

    expect(unwrapChartable(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/track/6DA3GA/example.org/episode.mp3')

    expect(unwrapChartable(value)).toBeUndefined()
  })
})
