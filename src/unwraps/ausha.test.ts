import { describe, expect, it } from 'bun:test'
import { unwrapAusha } from './ausha.js'

describe('unwrapAusha', () => {
  it('should extract a target after the episode id and keep its query string', () => {
    const value = new URL(
      'https://tr.ausha.co/BDMmula5dZWo/example.com/v1/stitch/ausha.mp3?tags=5e048821ca608&podcastUrl=https%3A%2F%2Fexample.org%2FBDMmula5dZWo.mp3',
    )

    const expected =
      'example.com/v1/stitch/ausha.mp3?tags=5e048821ca608&podcastUrl=https%3A%2F%2Fexample.org%2FBDMmula5dZWo.mp3'

    expect(unwrapAusha(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://tr.ausha.co/B1mQPt1VGOew/dts.podtrac.com/redirect.mp3/example.com/episode.mp3',
    )
    const expected = 'dts.podtrac.com/redirect.mp3/example.com/episode.mp3'

    expect(unwrapAusha(value)).toBe(expected)
  })

  it('should return undefined when the episode id has no target', () => {
    const value = new URL('https://tr.ausha.co/BDMmula5dZWo/')

    expect(unwrapAusha(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://tr.ausha.co/about/example.com/episode.mp3')

    expect(unwrapAusha(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.org/BDMmula5dZWo/example.com/episode.mp3')

    expect(unwrapAusha(value)).toBeUndefined()
  })

  it('should return undefined for an id shorter than 12 characters', () => {
    const value = new URL('https://tr.ausha.co/BDMmula5dZW/example.com/episode.mp3')

    expect(unwrapAusha(value)).toBeUndefined()
  })

  it('should return undefined for a target with no episode id', () => {
    const value = new URL('https://tr.ausha.co/cdn.ausha.fm/episode.mp3')

    expect(unwrapAusha(value)).toBeUndefined()
  })

  it('should return undefined for an id below another segment', () => {
    const value = new URL('https://tr.ausha.co/a/BDMmula5dZWo/example.com/episode.mp3')

    expect(unwrapAusha(value)).toBeUndefined()
  })
})
