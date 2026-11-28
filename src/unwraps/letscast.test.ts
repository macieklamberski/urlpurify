import { describe, expect, it } from 'bun:test'
import { unwrapLetscast } from './letscast.js'

describe('unwrapLetscast', () => {
  it('should extract the target with its query', () => {
    const value = new URL(
      'https://letscast.fm/track/https://lc.podcast-hosting.org/lcdn.letscast.fm/media/podcast/72ec4742/episode/49d5ee4f.mp3?t=1664291494&awCollectionId=lc-80148&awEpisodeId=49d5ee4f',
    )

    const expected =
      'https://lc.podcast-hosting.org/lcdn.letscast.fm/media/podcast/72ec4742/episode/49d5ee4f.mp3?t=1664291494&awCollectionId=lc-80148&awEpisodeId=49d5ee4f'

    expect(unwrapLetscast(value)).toBe(expected)
  })

  it('should add https to a target without a scheme behind an http prefix', () => {
    const value = new URL(
      'http://letscast.fm/track/lc.podcast-hosting.org/lcdn.letscast.fm/media/podcast/72ec4742/episode/49d5ee4f.mp3',
    )
    const expected =
      'lc.podcast-hosting.org/lcdn.letscast.fm/media/podcast/72ec4742/episode/49d5ee4f.mp3'

    expect(unwrapLetscast(value)).toBe(expected)
  })

  it('should return undefined for an empty target', () => {
    const value = new URL('https://letscast.fm/track/')

    expect(unwrapLetscast(value)).toBeUndefined()
  })

  it('should return undefined for other paths', () => {
    const value = new URL(
      'https://letscast.fm/podcasts/example-show/track/https://example.com/episode.mp3',
    )

    expect(unwrapLetscast(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/track/https://example.org/episode.mp3')

    expect(unwrapLetscast(value)).toBeUndefined()
  })
})
