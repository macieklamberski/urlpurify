import { describe, expect, it } from 'bun:test'
import { unwrapArttrack } from './arttrack.js'

describe('unwrapArttrack', () => {
  it('should extract a target after the campaign id', () => {
    const url = new URL(
      'https://arttrk.com/p/BZZPR/example.com/2551804/episodes/19434057-elise-joshi.mp3',
    )

    expect(unwrapArttrack(url)).toBe(
      'https://example.com/2551804/episodes/19434057-elise-joshi.mp3',
    )
  })

  it('should keep the query string of the target', () => {
    const url = new URL('https://arttrk.com/p/ABMA5/example.com/episode.mp3?source=rss')

    expect(unwrapArttrack(url)).toBe('https://example.com/episode.mp3?source=rss')
  })

  it('should return undefined when the campaign id has no target', () => {
    const url = new URL('https://arttrk.com/p/ABMA5/')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined when the campaign id is missing', () => {
    const url = new URL('https://arttrk.com/p/example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://arttrk.com/about/example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/p/ABMA5/example.org/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for an id longer than 5 characters', () => {
    const url = new URL('https://arttrk.com/p/BZZPR1/example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for an empty campaign id', () => {
    const url = new URL('https://arttrk.com/p//example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for a target with no campaign id', () => {
    const url = new URL('https://arttrk.com/p/a.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for another one-letter path', () => {
    const url = new URL('https://arttrk.com/x/BZZPR/example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const url = new URL('https://arttrk.com/a/p/BZZPR/example.com/episode.mp3')

    expect(unwrapArttrack(url)).toBeUndefined()
  })
})
