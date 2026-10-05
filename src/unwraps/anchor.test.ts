import { describe, expect, it } from 'bun:test'
import { unwrapAnchor } from './anchor.js'

describe('unwrapAnchor', () => {
  it('should extract an encoded target from the play prefix', () => {
    const url = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fstaging%2F2025-2-24%2F397125898-44100-2-0b086fce0cdf073a.mp3',
    )

    expect(unwrapAnchor(url)).toBe(
      'https://example.com/staging/2025-2-24/397125898-44100-2-0b086fce0cdf073a.mp3',
    )
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://anchor.fm/s/106db04/podcast/play/119132135/https%253A%252F%252Fexample.com%252Fstaging%252F2026-3-27%252Ff255e6f7.mp3',
    )

    expect(unwrapAnchor(url)).toBe('https://example.com/staging/2026-3-27/f255e6f7.mp3')
  })

  it('should extract a plain target', () => {
    const url = new URL(
      'https://anchor.fm/s/4f9b1d84/podcast/play/37904881/https://example.com/staging/2021-6-27/fb129d61.mp3',
    )

    expect(unwrapAnchor(url)).toBe('https://example.com/staging/2021-6-27/fb129d61.mp3')
  })

  it('should extract a target after the sponsor segment', () => {
    const url = new URL(
      'https://anchor.fm/s/45b703f0/podcast/play/24777206/sponsor/a4gc5gq,a4gc3vs/https%3A%2F%2Fexample.com%2Fstaging%2F2021-06-07%2F1cf2c2a5.m4a',
    )

    expect(unwrapAnchor(url)).toBe('https://example.com/staging/2021-06-07/1cf2c2a5.m4a')
  })

  it('should keep the encoded target query', () => {
    const url = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fepisode.mp3%3Fupdated%3D1',
    )

    expect(unwrapAnchor(url)).toBe('https://example.com/episode.mp3?updated=1')
  })

  it('should drop the query that follows the prefix', () => {
    const url = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fepisode.mp3?source=audiofictionreleases',
    )

    expect(unwrapAnchor(url)).toBe('https://example.com/episode.mp3')
  })

  it('should return undefined for a target cut short inside an escape', () => {
    const url = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2',
    )

    expect(unwrapAnchor(url)).toBeUndefined()
  })

  it('should return undefined for the sponsor link', () => {
    const url = new URL(
      'https://anchor.fm/s/1cbe4d0/podcast/sponsor/acugkf/url/https%3A%2F%2Fexample.com%2Fapp',
    )

    expect(unwrapAnchor(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://anchor.fm/s/102d2c870/podcast/rss')

    expect(unwrapAnchor(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.org%2Fepisode.mp3',
    )

    expect(unwrapAnchor(url)).toBeUndefined()
  })
})
