import { describe, expect, it } from 'bun:test'
import { unwrapCastPlus } from './castPlus.js'

describe('unwrapCastPlus', () => {
  it('should extract a target without a scheme as http', () => {
    const url = new URL(
      'http://traffic.cast.plus/57b5ec8fb1e770152ebcd8ae/example.com/soteriology101/39_Soteriology_101_Why_Pray.mp3',
    )

    expect(unwrapCastPlus(url)).toBe(
      'http://example.com/soteriology101/39_Soteriology_101_Why_Pray.mp3',
    )
  })

  it('should extract a target without a scheme as http from an https prefix', () => {
    const url = new URL(
      'https://traffic.cast.plus/596335d10893a805f9063f2b/example.com/download/UFC13/UFC13.mp3',
    )

    expect(unwrapCastPlus(url)).toBe('http://example.com/download/UFC13/UFC13.mp3')
  })

  it('should extract a target with a scheme', () => {
    const url = new URL(
      'http://traffic.cast.plus/573b2dc153e385d0698bb64d/https://example.com/stream/234880404-chapter-number-3.mp3',
    )

    expect(unwrapCastPlus(url)).toBe('https://example.com/stream/234880404-chapter-number-3.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('http://traffic.cast.plus/57b5ec8fb1e770152ebcd8ae/')

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined for a show id shorter than 24 characters', () => {
    const url = new URL('http://traffic.cast.plus/57b5ec8fb1e770152ebcd8a/example.com/episode.mp3')

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined for a show id longer than 24 characters', () => {
    const url = new URL(
      'http://traffic.cast.plus/57b5ec8fb1e770152ebcd8ae0/example.com/episode.mp3',
    )

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined for a show id with non-hex characters', () => {
    const url = new URL('http://traffic.cast.plus/57b5ec8fb1e770152ebcd8az/example.com/episode.mp3')

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined when the show id is not the first segment', () => {
    const url = new URL(
      'http://traffic.cast.plus/lander/57b5ec8fb1e770152ebcd8ae/example.com/episode.mp3',
    )

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('http://traffic.cast.plus/lander')

    expect(unwrapCastPlus(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/57b5ec8fb1e770152ebcd8ae/example.org/episode.mp3')

    expect(unwrapCastPlus(url)).toBeUndefined()
  })
})
