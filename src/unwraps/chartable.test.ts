import { describe, expect, it } from 'bun:test'
import { unwrapChartable } from './chartable.js'

describe('unwrapChartable', () => {
  it('should extract a target without a scheme from chrt.fm', () => {
    const url = new URL('https://chrt.fm/track/6DA3GA/example.com/artofcomposing/13_AOC_013.mp3')

    expect(unwrapChartable(url)).toBe('https://example.com/artofcomposing/13_AOC_013.mp3')
  })

  it('should extract a target without a scheme from chtbl.com', () => {
    const url = new URL(
      'https://chtbl.com/track/CF4834/example.com/static/554a6e7e/t/623f603b/1648320630371/Episode+110.mp3',
    )

    expect(unwrapChartable(url)).toBe(
      'https://example.com/static/554a6e7e/t/623f603b/1648320630371/Episode+110.mp3',
    )
  })

  it('should keep the scheme and query string of a target', () => {
    const url = new URL(
      'https://chrt.fm/track/G23FB8/http://example.com/574473/audio--418670.mp3?v=1657042933',
    )

    expect(unwrapChartable(url)).toBe('http://example.com/574473/audio--418670.mp3?v=1657042933')
  })

  it('should skip an empty segment after the id', () => {
    const url = new URL(
      'https://chtbl.com/track/6538//example.com/forcedn/bordersofsleep/SBS_EP0049.mp3',
    )

    expect(unwrapChartable(url)).toBe('https://example.com/forcedn/bordersofsleep/SBS_EP0049.mp3')
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://chtbl.com/track/3G835/podtrac.com/pts/redirect.mp3/example.com/d/clips/audio.mp3?utm_source=Podcast',
    )

    expect(unwrapChartable(url)).toBe(
      'https://podtrac.com/pts/redirect.mp3/example.com/d/clips/audio.mp3?utm_source=Podcast',
    )
  })

  it('should return undefined when the id is missing', () => {
    const url = new URL(
      'https://chtbl.com/track/http://example.com/stream/1075446052-free-picks.mp3',
    )

    expect(unwrapChartable(url)).toBeUndefined()
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://chrt.fm/track/6DA3GA/')

    expect(unwrapChartable(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the hosts', () => {
    const url = new URL('https://chtbl.com/podcasts/6DA3GA/example.com/episode.mp3')

    expect(unwrapChartable(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/track/6DA3GA/example.org/episode.mp3')

    expect(unwrapChartable(url)).toBeUndefined()
  })
})
