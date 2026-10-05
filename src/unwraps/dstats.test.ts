import { describe, expect, it } from 'bun:test'
import { unwrapDstats } from './dstats.js'

describe('unwrapDstats', () => {
  it('should extract the target from the download path', () => {
    const url = new URL(
      'http://dstats.net/download/http://example.org/download/mail-animations.pdf',
    )

    expect(unwrapDstats(url)).toBe('http://example.org/download/mail-animations.pdf')
  })

  it('should keep the query of a target in the download path', () => {
    const url = new URL(
      'http://dstats.net/download/http://dl.example.com/u/7561270/showreel.mov?dl=1',
    )

    expect(unwrapDstats(url)).toBe('http://dl.example.com/u/7561270/showreel.mov?dl=1')
  })

  it('should extract the target from the file param of download.php', () => {
    const url = new URL(
      'http://dstats.net/download.php?file=https://www.example.com/s/05c15bc24f1a090c443f',
    )

    expect(unwrapDstats(url)).toBe('https://www.example.com/s/05c15bc24f1a090c443f')
  })

  it('should extract the target from the url param of fwd.php', () => {
    const url = new URL('http://dstats.net/fwd.php?url=https://example.de')

    expect(unwrapDstats(url)).toBe('https://example.de')
  })

  it('should return undefined for a download path without a scheme', () => {
    const url = new URL('http://dstats.net/download/example.org/file.pdf')

    expect(unwrapDstats(url)).toBeUndefined()
  })

  it('should return undefined for a download segment deeper in the path', () => {
    const url = new URL('http://dstats.net/show/download/http://example.org/file.pdf')

    expect(unwrapDstats(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://dstats.net/sitetracker.php?file=https://example.de/a.pdf&url=https://example.de',
    )

    expect(unwrapDstats(url)).toBeUndefined()
  })

  it('should return undefined for the download path on another host', () => {
    const url = new URL('http://example.com/download/http://example.org/file.pdf')

    expect(unwrapDstats(url)).toBeUndefined()
  })
})
