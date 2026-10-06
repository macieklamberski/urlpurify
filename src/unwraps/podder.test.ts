import { describe, expect, it } from 'bun:test'
import { unwrapPodder } from './podder.js'

describe('unwrapPodder', () => {
  it('should extract a target without a scheme and keep its query string', () => {
    const url = new URL(
      'https://p.podderapp.com/7764874378/example.com/2597144/episodes/19435573-134.mp3?download=true',
    )

    expect(unwrapPodder(url)).toBe(
      'https://example.com/2597144/episodes/19435573-134.mp3?download=true',
    )
  })

  it('should extract a target with a scheme', () => {
    const url = new URL(
      'https://p.podderapp.com/9103131664/https://example.com/Podcast/20260630_thebriefing.mp3',
    )

    expect(unwrapPodder(url)).toBe('https://example.com/Podcast/20260630_thebriefing.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://p.podderapp.com/9103131664/')

    expect(unwrapPodder(url)).toBeUndefined()
  })

  it('should return undefined when the show id is not a number', () => {
    const url = new URL('https://p.podderapp.com/podcast/example.com/episode.mp3')

    expect(unwrapPodder(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/9103131664/example.org/episode.mp3')

    expect(unwrapPodder(url)).toBeUndefined()
  })
})
