import { describe, expect, it } from 'bun:test'
import { unwrapAusha } from './ausha.js'

describe('unwrapAusha', () => {
  it('should extract a target after the episode id and keep its query string', () => {
    const url = new URL(
      'https://tr.ausha.co/BDMmula5dZWo/example.com/v1/stitch/ausha.mp3?tags=5e048821ca608&podcastUrl=https%3A%2F%2Fexample.org%2FBDMmula5dZWo.mp3',
    )

    expect(unwrapAusha(url)).toBe(
      'https://example.com/v1/stitch/ausha.mp3?tags=5e048821ca608&podcastUrl=https%3A%2F%2Fexample.org%2FBDMmula5dZWo.mp3',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://tr.ausha.co/B1mQPt1VGOew/dts.podtrac.com/redirect.mp3/example.com/episode.mp3',
    )

    expect(unwrapAusha(url)).toBe('https://dts.podtrac.com/redirect.mp3/example.com/episode.mp3')
  })

  it('should return undefined when the episode id has no target', () => {
    const url = new URL('https://tr.ausha.co/BDMmula5dZWo/')

    expect(unwrapAusha(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://tr.ausha.co/about/example.com/episode.mp3')

    expect(unwrapAusha(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.org/BDMmula5dZWo/example.com/episode.mp3')

    expect(unwrapAusha(url)).toBeUndefined()
  })

  it('should return undefined for an id shorter than 12 characters', () => {
    const url = new URL('https://tr.ausha.co/BDMmula5dZW/example.com/episode.mp3')

    expect(unwrapAusha(url)).toBeUndefined()
  })

  it('should return undefined for a target with no episode id', () => {
    const url = new URL('https://tr.ausha.co/cdn.ausha.fm/episode.mp3')

    expect(unwrapAusha(url)).toBeUndefined()
  })

  it('should return undefined for an id below another segment', () => {
    const url = new URL('https://tr.ausha.co/a/BDMmula5dZWo/example.com/episode.mp3')

    expect(unwrapAusha(url)).toBeUndefined()
  })
})
