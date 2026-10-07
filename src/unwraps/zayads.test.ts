import { describe, expect, it } from 'bun:test'
import { unwrapZayads } from './zayads.js'

describe('unwrapZayads', () => {
  it('should extract a target after the campaign id', () => {
    const url = new URL(
      'https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlB/https://example.com/16/4e/50/26dac342a89b1077ca77327464.mp3',
    )

    expect(unwrapZayads(url)).toBe('https://example.com/16/4e/50/26dac342a89b1077ca77327464.mp3')
  })

  it('should keep the query string of the target', () => {
    const url = new URL(
      'https://track.zayads.ru/a_k5uvjjT6OY4pAKJM0ACh/https://example.com/1/download/audio.mp3?v=2&media=rss',
    )

    expect(unwrapZayads(url)).toBe('https://example.com/1/download/audio.mp3?v=2&media=rss')
  })

  it('should keep an http target as http', () => {
    const url = new URL(
      'https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlB/http://example.com/episode.mp3',
    )

    expect(unwrapZayads(url)).toBe('http://example.com/episode.mp3')
  })

  it('should add https to a target without a scheme', () => {
    const url = new URL('https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlB/example.com/episode.mp3')

    expect(unwrapZayads(url)).toBe('https://example.com/episode.mp3')
  })

  it('should add https to a target without a scheme behind an http prefix', () => {
    const url = new URL('http://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlB/example.com/episode.mp3')

    expect(unwrapZayads(url)).toBe('https://example.com/episode.mp3')
  })

  it('should return undefined when the campaign id has no target', () => {
    const url = new URL('https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlB/')

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for the feed proxy on the host', () => {
    const url = new URL('https://track.zayads.ru/rss/a_k5uvjjT6OY4pAKJM0ACh/')

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const url = new URL(
      'https://track.zayads.ru/rss/QtN-zEoLRmG15Q7OWDfTlB/https://example.com/episode.mp3',
    )

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for a campaign id shorter than 22 characters', () => {
    const url = new URL(
      'https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTl/https://example.com/episode.mp3',
    )

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for a campaign id longer than 22 characters', () => {
    const url = new URL(
      'https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfTlBB/https://example.com/episode.mp3',
    )

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for a campaign id with a character outside base64url', () => {
    const url = new URL(
      'https://track.zayads.ru/QtN-zEoLRmG15Q7OWDfT.B/https://example.com/episode.mp3',
    )

    expect(unwrapZayads(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/QtN-zEoLRmG15Q7OWDfTlB/https://example.org/episode.mp3',
    )

    expect(unwrapZayads(url)).toBeUndefined()
  })
})
