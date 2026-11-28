import { describe, expect, it } from 'bun:test'
import { unwrapDstats } from './dstats.js'

describe('unwrapDstats', () => {
  it('should extract the target from the download path', () => {
    const value = new URL(
      'http://dstats.net/download/http://example.org/download/mail-animations.pdf',
    )
    const expected = 'http://example.org/download/mail-animations.pdf'

    expect(unwrapDstats(value)).toBe(expected)
  })

  it('should keep the query of a target in the download path', () => {
    const value = new URL(
      'http://dstats.net/download/http://dl.example.com/u/7561270/showreel.mov?dl=1',
    )
    const expected = 'http://dl.example.com/u/7561270/showreel.mov?dl=1'

    expect(unwrapDstats(value)).toBe(expected)
  })

  it('should extract the target from the file param of download.php', () => {
    const value = new URL(
      'http://dstats.net/download.php?file=https://www.example.com/s/05c15bc24f1a090c443f',
    )
    const expected = 'https://www.example.com/s/05c15bc24f1a090c443f'

    expect(unwrapDstats(value)).toBe(expected)
  })

  it('should extract the target from the url param of fwd.php', () => {
    const value = new URL('http://dstats.net/fwd.php?url=https://example.de')
    const expected = 'https://example.de'

    expect(unwrapDstats(value)).toBe(expected)
  })

  it('should return undefined for a download path without a scheme', () => {
    const value = new URL('http://dstats.net/download/example.org/file.pdf')

    expect(unwrapDstats(value)).toBeUndefined()
  })

  it('should return undefined for a download segment deeper in the path', () => {
    const value = new URL('http://dstats.net/show/download/http://example.org/file.pdf')

    expect(unwrapDstats(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://dstats.net/sitetracker.php?file=https://example.de/a.pdf&url=https://example.de',
    )

    expect(unwrapDstats(value)).toBeUndefined()
  })

  it('should return undefined for the download path on another host', () => {
    const value = new URL('http://example.com/download/http://example.org/file.pdf')

    expect(unwrapDstats(value)).toBeUndefined()
  })

  it('should decode an encoded download target', () => {
    const value = new URL(
      'http://dstats.net/download/https%3A%2F%2Fexample.com%2Fepisode.mp3%3Fa%3D1',
    )
    const expected = 'https://example.com/episode.mp3?a=1'

    expect(unwrapDstats(value)).toBe(expected)
  })
})
