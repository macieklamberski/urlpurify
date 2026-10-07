import { describe, expect, it } from 'bun:test'
import { unwrapPodkite } from './podkite.js'

describe('unwrapPodkite', () => {
  it('should extract an https target and keep its query string', () => {
    const url = new URL(
      'https://growx.podkite.com/https/PKospnniic/example.com/download-episode/5918/ep-531.mp3?ref=feed',
    )

    expect(unwrapPodkite(url)).toBe('https://example.com/download-episode/5918/ep-531.mp3?ref=feed')
  })

  it('should extract an http target when the scheme segment is http', () => {
    const url = new URL('https://growx.podkite.com/http/PKjmzt90ew/example.com/episodes/audio.mp3')

    expect(unwrapPodkite(url)).toBe('http://example.com/episodes/audio.mp3')
  })

  it('should take the scheme from the segment, not from the prefix', () => {
    const url = new URL('http://growx.podkite.com/https/PKjmzt90ew/example.com/episodes/audio.mp3')

    expect(unwrapPodkite(url)).toBe('https://example.com/episodes/audio.mp3')
  })

  it('should extract a target behind a numeric show id', () => {
    const url = new URL(
      'https://growx.podkite.com/https/1521538256/example.com/731691db/e68d29e5.mp3',
    )

    expect(unwrapPodkite(url)).toBe('https://example.com/731691db/e68d29e5.mp3')
  })

  it('should return undefined when the scheme segment is not http or https', () => {
    const url = new URL('https://growx.podkite.com/ftp/PKjmzt90ew/example.com/episodes/audio.mp3')

    expect(unwrapPodkite(url)).toBeUndefined()
  })

  it('should return undefined when the scheme segment is not at the start of the path', () => {
    const url = new URL(
      'https://growx.podkite.com/listen/https/PKjmzt90ew/example.com/episodes/audio.mp3',
    )

    expect(unwrapPodkite(url)).toBeUndefined()
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://growx.podkite.com/https/PKjmzt90ew/')

    expect(unwrapPodkite(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/https/PKjmzt90ew/example.org/episodes/audio.mp3')

    expect(unwrapPodkite(url)).toBeUndefined()
  })
})
