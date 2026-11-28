import { describe, expect, it } from 'bun:test'
import { unwrapGodcaster } from './godcaster.js'

describe('unwrapGodcaster', () => {
  it('should extract a twice-encoded target from the episode prefix', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/285278/59424742195/https%253A%252F%252Fexample.com%252FOURNE3401812353.mp3',
    )
    const expected = 'https://example.com/OURNE3401812353.mp3'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should extract a twice-encoded http target', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/316033/53216185989/http%253A%252F%252Fexample.com%252Fpd%252Fp%252F650742%252Fsp%252F65074200%252FserveFlavor',
    )
    const expected = 'http://example.com/pd/p/650742/sp/65074200/serveFlavor'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should keep the query of a plain target', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/123/456/789/https://example.com/episode.mp3?v=2',
    )
    const expected = 'https://example.com/episode.mp3?v=2'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should keep the encoded target query', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/414103/59479668091/https%253A%252F%252Fexample.com%252Fsecure%252F373.mp3%253Fdest-id%253D2148587',
    )
    const expected = 'https://example.com/secure/373.mp3?dest-id=2148587'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should keep the fragment', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/285278/59424742195/https%253A%252F%252Fexample.com%252Fepisode.mp3#t=10',
    )
    const expected = 'https://example.com/episode.mp3#t=10'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should leave a target nested one level deeper encoded', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/334/7168343/56953332435/https%253A%252F%252Fanchor.fm%252Fs%252F9f2d1794%252Fpodcast%252Fplay%252F121984296%252Fhttps%25253A%25252F%25252Fexample.com%25252Fepisode.m4a',
    )
    const expected =
      'https://anchor.fm/s/9f2d1794/podcast/play/121984296/https%3A%2F%2Fexample.com%2Fepisode.m4a'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/285278/59424742195/https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should extract a target from the show link', () => {
    const value = new URL('https://go.godcaster.fm/act/sr/109?d=https%3A%2F%2Fexample.com%2Fgive')
    const expected = 'https://example.com/give'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should extract a target from the episode link', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/fr/645/6259483?d=https%3A%2F%2Fexample.com%2F2161184%2Fsupport',
    )
    const expected = 'https://example.com/2161184/support'

    expect(unwrapGodcaster(value)).toBe(expected)
  })

  it('should return undefined for the show link without an id', () => {
    const value = new URL('https://go.godcaster.fm/act/sr/?d=https%3A%2F%2Fexample.com%2Fgive')

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should return undefined for the episode link without the episode id', () => {
    const value = new URL('https://go.godcaster.fm/act/fr/645?d=https%3A%2F%2Fexample.com%2Fgive')

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should return undefined for the show link with a trailing path segment', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/sr/109/extra?d=https%3A%2F%2Fexample.com%2Fgive',
    )

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should return undefined for the show link on other hosts', () => {
    const value = new URL('https://example.com/act/sr/109?d=https%3A%2F%2Fexample.org%2Fgive')

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should return undefined when an id is missing', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/285278/https%253A%252F%252Fexample.com%252Fepisode.mp3',
    )

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/act/e/147/285278/59424742195/https%253A%252F%252Fexample.org%252Fepisode.mp3',
    )

    expect(unwrapGodcaster(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://go.godcaster.fm/act/e/147/285278/59424742195/https%253A%252F%252Fexample.com%252FOURNE3401812353.mp3%23top',
    )
    const expected = 'https://example.com/OURNE3401812353.mp3#top'

    expect(unwrapGodcaster(value)).toBe(expected)
  })
})
