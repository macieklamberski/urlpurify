import { describe, expect, it } from 'bun:test'
import { unwrapBlubrry } from './blubrry.js'

describe('unwrapBlubrry', () => {
  it('should extract a target without a scheme after the show', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/example.com/v2/episodes/18884399/download.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/v2/episodes/18884399/download.mp3')
  })

  it('should extract a target with a scheme after the show', () => {
    const url = new URL(
      'http://media.blubrry.com/podcast_horoscopo/http://example.com/16150583.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('http://example.com/16150583.mp3')
  })

  it('should extract a target after the p segment', () => {
    const url = new URL(
      'http://media.blubrry.com/socialmediachurch/p/example.com/wp-content/uploads/2014/07/ep93.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/wp-content/uploads/2014/07/ep93.mp3')
  })

  it('should extract a target after the s segment', () => {
    const url = new URL(
      'https://media.blubrry.com/the_rpg_academy/s/example.com/wp-content/uploads/2020/01/FM-137.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/wp-content/uploads/2020/01/FM-137.mp3')
  })

  it('should extract a target after the b segment', () => {
    const url = new URL(
      'http://media.blubrry.com/truth_about_fx/b/example.com/truth_about_fx/CP_-_Alex.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/truth_about_fx/CP_-_Alex.mp3')
  })

  it('should extract a target with a scheme after the s segment', () => {
    const url = new URL(
      'https://media.blubrry.com/porquepodcast/s/https://example.com/v2/episodes/51973655/download.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/v2/episodes/51973655/download.mp3')
  })

  it('should skip an empty segment after the show', () => {
    const url = new URL(
      'https://media.blubrry.com/lead_your_life//example.com/lead-your-life-series/lylseries8.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/lead-your-life-series/lylseries8.mp3')
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/example.com/episode.mp3?updated=1700000000',
    )

    expect(unwrapBlubrry(url)).toBe('https://example.com/episode.mp3?updated=1700000000')
  })

  it('should peel a Blubrry prefix that wraps another', () => {
    const url = new URL(
      'https://media.blubrry.com/svegot/media.blubrry.com/svegot2/example.com/episode.mp3',
    )

    expect(unwrapBlubrry(url)).toBe('https://media.blubrry.com/svegot2/example.com/episode.mp3')
  })

  it('should return undefined for a file on Blubrry storage', () => {
    const url = new URL(
      'https://media.blubrry.com/leadership/content.blubrry.com/leadership/LTLEp46_PepedelRio.mp3',
    )

    expect(unwrapBlubrry(url)).toBeUndefined()
  })

  it('should return undefined for a file on Blubrry storage after the b segment', () => {
    const url = new URL(
      'http://media.blubrry.com/truth_about_fx/b/content.blubrry.com/truth_about_fx/CP_-_Alex.mp3',
    )

    expect(unwrapBlubrry(url)).toBeUndefined()
  })

  it('should return undefined when no host follows the show', () => {
    const url = new URL('https://media.blubrry.com/svegot/episodes/download.mp3')

    expect(unwrapBlubrry(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/svegot/example.org/episode.mp3')

    expect(unwrapBlubrry(url)).toBeUndefined()
  })
})
