import { describe, expect, it } from 'bun:test'
import { unwrapArttrack } from './arttrack.js'

describe('unwrapArttrack', () => {
  it('should extract a target after the campaign id', () => {
    const value = new URL(
      'https://arttrk.com/p/BZZPR/example.com/2551804/episodes/19434057-elise-joshi.mp3',
    )
    const expected = 'example.com/2551804/episodes/19434057-elise-joshi.mp3'

    expect(unwrapArttrack(value)).toBe(expected)
  })

  it('should keep the query string of the target', () => {
    const value = new URL('https://arttrk.com/p/ABMA5/example.com/episode.mp3?source=rss')
    const expected = 'example.com/episode.mp3?source=rss'

    expect(unwrapArttrack(value)).toBe(expected)
  })

  it('should return undefined when the campaign id has no target', () => {
    const value = new URL('https://arttrk.com/p/ABMA5/')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined when the campaign id is missing', () => {
    const value = new URL('https://arttrk.com/p/example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://arttrk.com/about/example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/p/ABMA5/example.org/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for an id longer than 5 characters', () => {
    const value = new URL('https://arttrk.com/p/BZZPR1/example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for an empty campaign id', () => {
    const value = new URL('https://arttrk.com/p//example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for a target with no campaign id', () => {
    const value = new URL('https://arttrk.com/p/a.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for another one-letter path', () => {
    const value = new URL('https://arttrk.com/x/BZZPR/example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const value = new URL('https://arttrk.com/a/p/BZZPR/example.com/episode.mp3')

    expect(unwrapArttrack(value)).toBeUndefined()
  })
})
