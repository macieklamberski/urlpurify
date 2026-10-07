import { describe, expect, it } from 'bun:test'
import { unwrapOp3 } from './op3.js'

describe('unwrapOp3', () => {
  it('should extract a target without a scheme', () => {
    const url = new URL(
      'https://op3.dev/e/example.com/download/anime-nostalgia/The%20Anime%20Nostalgia%20ep%20150.mp3',
    )

    expect(unwrapOp3(url)).toBe(
      'https://example.com/download/anime-nostalgia/The%20Anime%20Nostalgia%20ep%20150.mp3',
    )
  })

  it('should extract a target with a scheme', () => {
    const url = new URL('https://op3.dev/e/http://example.com/mk-ultra-create_digging_vol10.mp3')

    expect(unwrapOp3(url)).toBe('http://example.com/mk-ultra-create_digging_vol10.mp3')
  })

  it('should extract a target after the params segment and keep its query string', () => {
    const url = new URL(
      'https://op3.dev/e,pg=ea80522b-2fa0-4915-8fa9-c66a90302207/example.com/storage/audio.mp3?v=4c28e0c8',
    )

    expect(unwrapOp3(url)).toBe('https://example.com/storage/audio.mp3?v=4c28e0c8')
  })

  it('should extract a target after several params', () => {
    const url = new URL(
      'https://op3.dev/e,pg=a9a56b87-575a-5f6f-9636-cdf7b73e6230,hls=1/example.com/download/57-KDE_Express.mp3',
    )

    expect(unwrapOp3(url)).toBe('https://example.com/download/57-KDE_Express.mp3')
  })

  it('should skip an empty segment after the prefix', () => {
    const url = new URL(
      'https://op3.dev/e//example.com/episode/jasomfunradio/fun-in-slovakia/audio.mp3',
    )

    expect(unwrapOp3(url)).toBe(
      'https://example.com/episode/jasomfunradio/fun-in-slovakia/audio.mp3',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://op3.dev/e/dts.podtrac.com/redirect.mp3/example.com/hpm-newscast/newscast-2025-07-21-06.mp3',
    )

    expect(unwrapOp3(url)).toBe(
      'https://dts.podtrac.com/redirect.mp3/example.com/hpm-newscast/newscast-2025-07-21-06.mp3',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://op3.dev/e/')

    expect(unwrapOp3(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://op3.dev/show/example.com/episode.mp3')

    expect(unwrapOp3(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/e/example.org/episode.mp3')

    expect(unwrapOp3(url)).toBeUndefined()
  })

  it('should give a target without a scheme https behind an http prefix', () => {
    const url = new URL(
      'http://op3.dev/e/example.com/podcasts/kolomonashow/01-001-KolomonaShow.mp3',
    )

    expect(unwrapOp3(url)).toBe('https://example.com/podcasts/kolomonashow/01-001-KolomonaShow.mp3')
  })
})
