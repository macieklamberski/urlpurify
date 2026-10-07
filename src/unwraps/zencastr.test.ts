import { describe, expect, it } from 'bun:test'
import { unwrapZencastr } from './zencastr.js'

describe('unwrapZencastr', () => {
  it('should extract a target on r.zencastr.com', () => {
    const url = new URL(
      'https://r.zencastr.com/r/example.com/d/1437767933/cf372a7e-810f-4eab-8a55-34456ccc0d58/819be75e-f549-4f38-88d3-a2eb91ccb9da.mp3',
    )

    expect(unwrapZencastr(url)).toBe(
      'https://example.com/d/1437767933/cf372a7e-810f-4eab-8a55-34456ccc0d58/819be75e-f549-4f38-88d3-a2eb91ccb9da.mp3',
    )
  })

  it('should extract a target on r.zen.ai', () => {
    const url = new URL(
      'https://r.zen.ai/r/example.com/media/audio/transcoded/75c667ea-2739-4306-96be-e15097ef0853/episodes/audio/default.mp3',
    )

    expect(unwrapZencastr(url)).toBe(
      'https://example.com/media/audio/transcoded/75c667ea-2739-4306-96be-e15097ef0853/episodes/audio/default.mp3',
    )
  })

  it('should give the target https when the prefix is on http', () => {
    const url = new URL(
      'http://r.zen.ai/r/example.com/wp-content/uploads/2019/11/PolicyViz_EpisodeNo163.mp3',
    )

    expect(unwrapZencastr(url)).toBe(
      'https://example.com/wp-content/uploads/2019/11/PolicyViz_EpisodeNo163.mp3',
    )
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://r.zencastr.com/r/example.com/web/episode/9a7b2c.mp3?updated=1778670796',
    )

    expect(unwrapZencastr(url)).toBe(
      'https://example.com/web/episode/9a7b2c.mp3?updated=1778670796',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://r.zencastr.com/r/')

    expect(unwrapZencastr(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://r.zencastr.com/rss/example.com/episode.mp3')

    expect(unwrapZencastr(url)).toBeUndefined()
  })

  it('should return undefined for the prefix below another path', () => {
    const url = new URL('https://r.zencastr.com/x/r/example.com/episode.mp3')

    expect(unwrapZencastr(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r/example.org/episode.mp3')

    expect(unwrapZencastr(url)).toBeUndefined()
  })
})
