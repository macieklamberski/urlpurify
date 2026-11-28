import { describe, expect, it } from 'bun:test'
import { unwrapMintDownloads } from './mintDownloads.js'

describe('unwrapMintDownloads', () => {
  it('should extract the target from the counter under the stats folder', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/uploads/file/report.pdf',
    )
    const expected = 'http://www.example.com/uploads/file/report.pdf'

    expect(unwrapMintDownloads(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapMintDownloads(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapMintDownloads(value)).toBe(expected)
  })

  it('should extract the target from the counter under the mint folder', () => {
    const value = new URL(
      'http://www.example.com/mint/pepper/orderedlist/downloads/download.php?file=http%3A%2F%2Fwww.example.com%2Fdocs%2Fbrief.pdf',
    )
    const expected = 'http://www.example.com/docs/brief.pdf'

    expect(unwrapMintDownloads(value)).toBe(expected)
  })

  it('should extract the target beside a referrer', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/a.pdf&ref=http%3A//www.example.com/post',
    )
    const expected = 'http://www.example.com/a.pdf'

    expect(unwrapMintDownloads(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/downloads/download.php?file=uploads/file/report.pdf',
    )

    expect(unwrapMintDownloads(value)).toBeUndefined()
  })

  it('should return undefined for the counter without file', () => {
    const value = new URL('http://www.example.com/stats/pepper/orderedlist/downloads/download.php')

    expect(unwrapMintDownloads(value)).toBeUndefined()
  })

  it('should return undefined for the counter at the root', () => {
    const value = new URL(
      'http://www.example.com/pepper/orderedlist/downloads/download.php?file=http%3A//www.example.com/a.pdf',
    )

    expect(unwrapMintDownloads(value)).toBeUndefined()
  })

  it('should return undefined for another pepper', () => {
    const value = new URL(
      'http://www.example.com/stats/pepper/orderedlist/outclicks/download.php?file=http%3A//www.example.com/a.pdf',
    )

    expect(unwrapMintDownloads(value)).toBeUndefined()
  })
})
