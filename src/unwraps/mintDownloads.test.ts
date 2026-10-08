import { describe, expect, it } from 'bun:test'
import { unwrapMintDownloads } from './mintDownloads.js'

describe('unwrapMintDownloads', () => {
  it('should extract the target from the counter under the stats folder', () => {
    const url = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/uploads/file/report.pdf',
    )

    expect(unwrapMintDownloads(url)).toBe('http://www.example.com/uploads/file/report.pdf')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=https://example.org/search/a+b',
    )

    expect(unwrapMintDownloads(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract the target from the counter under the mint folder', () => {
    const url = new URL(
      'http://www.example.com/mint/pepper/orderedlist/downloads/download.php?file=http%3A%2F%2Fwww.example.com%2Fdocs%2Fbrief.pdf',
    )

    expect(unwrapMintDownloads(url)).toBe('http://www.example.com/docs/brief.pdf')
  })

  it('should extract the target beside a referrer', () => {
    const url = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/a.pdf&ref=http%3A//www.example.com/post',
    )

    expect(unwrapMintDownloads(url)).toBe('http://www.example.com/a.pdf')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=uploads/file/report.pdf',
    )

    expect(unwrapMintDownloads(url)).toBeUndefined()
  })

  it('should return undefined for the counter without file', () => {
    const url = new URL('http://www.example.com/stats/pepper/orderedlist/downloads/download.php')

    expect(unwrapMintDownloads(url)).toBeUndefined()
  })

  it('should return undefined for the counter at the root', () => {
    const url = new URL(
      'http://www.example.com/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/a.pdf',
    )

    expect(unwrapMintDownloads(url)).toBeUndefined()
  })

  it('should return undefined for another pepper', () => {
    const url = new URL(
      'http://www.example.com/stats/pepper/orderedlist/outclicks/download.php?file=http%3A//www.example.com/a.pdf',
    )

    expect(unwrapMintDownloads(url)).toBeUndefined()
  })
})
