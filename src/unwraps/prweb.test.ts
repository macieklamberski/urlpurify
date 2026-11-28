import { describe, expect, it } from 'bun:test'
import { unwrapPrweb } from './prweb.js'

describe('unwrapPrweb', () => {
  it('should extract the target from the click tracker', () => {
    const value = new URL('http://www.prweb.net/Redirect.aspx?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==')
    const expected = 'http://www.example.com'

    expect(unwrapPrweb(value)).toBe(expected)
  })

  it('should extract a target with its own query', () => {
    const value = new URL(
      'http://www.prweb.net/Redirect.aspx?id=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vbmV3cy9yZWxlYXNlP2lkPTQyJmxhbmc9ZW4=',
    )
    const expected = 'https://www.example.com/news/release?id=42&lang=en'

    expect(unwrapPrweb(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'http://www.prweb.net/Redirect.aspx?id=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=',
    )

    expect(unwrapPrweb(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker without id', () => {
    const value = new URL('http://www.prweb.net/Redirect.aspx')

    expect(unwrapPrweb(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.prweb.net/releases/2016/10/prweb123.htm?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==',
    )

    expect(unwrapPrweb(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/Redirect.aspx?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==')

    expect(unwrapPrweb(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://www.prweb.net/Redirect.aspx?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbSN0b3A%3D',
    )
    const expected = 'http://www.example.com#top'

    expect(unwrapPrweb(value)).toBe(expected)
  })
})
