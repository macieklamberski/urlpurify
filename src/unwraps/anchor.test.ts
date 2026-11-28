import { describe, expect, it } from 'bun:test'
import { unwrapAnchor } from './anchor.js'

describe('unwrapAnchor', () => {
  it('should extract an encoded target from the play prefix', () => {
    const value = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fstaging%2F2025-2-24%2F397125898-44100-2-0b086fce0cdf073a.mp3',
    )
    const expected = 'https://example.com/staging/2025-2-24/397125898-44100-2-0b086fce0cdf073a.mp3'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://anchor.fm/s/106db04/podcast/play/119132135/https%253A%252F%252Fexample.com%252Fstaging%252F2026-3-27%252Ff255e6f7.mp3',
    )
    const expected = 'https://example.com/staging/2026-3-27/f255e6f7.mp3'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should extract a plain target', () => {
    const value = new URL(
      'https://anchor.fm/s/4f9b1d84/podcast/play/37904881/https://example.com/staging/2021-6-27/fb129d61.mp3',
    )
    const expected = 'https://example.com/staging/2021-6-27/fb129d61.mp3'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should keep the query of a plain target', () => {
    const value = new URL(
      'https://anchor.fm/s/4f9b1d84/podcast/play/37904881/https://example.com/staging/2021-6-27/fb129d61.mp3?updated=1',
    )
    const expected = 'https://example.com/staging/2021-6-27/fb129d61.mp3?updated=1'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should extract a target after the sponsor segment', () => {
    const value = new URL(
      'https://anchor.fm/s/45b703f0/podcast/play/24777206/sponsor/a4gc5gq,a4gc3vs/https%3A%2F%2Fexample.com%2Fstaging%2F2021-06-07%2F1cf2c2a5.m4a',
    )
    const expected = 'https://example.com/staging/2021-06-07/1cf2c2a5.m4a'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should keep the encoded target query', () => {
    const value = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fepisode.mp3%3Fupdated%3D1',
    )
    const expected = 'https://example.com/episode.mp3?updated=1'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should drop the query that follows an encoded target', () => {
    const value = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fepisode.mp3?source=audiofictionreleases',
    )
    const expected = 'https://example.com/episode.mp3'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://anchor.fm/s/106db04/podcast/play/119132135/https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapAnchor(value)).toBe(expected)
  })

  it('should return undefined for the sponsor link', () => {
    const value = new URL(
      'https://anchor.fm/s/1cbe4d0/podcast/sponsor/acugkf/url/https%3A%2F%2Fexample.com%2Fapp',
    )

    expect(unwrapAnchor(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://anchor.fm/s/102d2c870/podcast/rss')

    expect(unwrapAnchor(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.org%2Fepisode.mp3',
    )

    expect(unwrapAnchor(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://anchor.fm/s/102d2c870/podcast/play/100291057/https%3A%2F%2Fexample.com%2Fstaging%2F2025-2-24%2F397125898-44100-2-0b086fce0cdf073a.mp3%23top',
    )
    const expected =
      'https://example.com/staging/2025-2-24/397125898-44100-2-0b086fce0cdf073a.mp3#top'

    expect(unwrapAnchor(value)).toBe(expected)
  })
})
