import { describe, expect, it } from 'bun:test'
import { unwrapPrweb } from './prweb.js'

describe('unwrapPrweb', () => {
  it('should extract the target from the click tracker', () => {
    const url = new URL('http://www.prweb.net/Redirect.aspx?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==')

    expect(unwrapPrweb(url)).toBe('http://www.example.com')
  })

  it('should extract a target with its own query', () => {
    const url = new URL(
      'http://www.prweb.net/Redirect.aspx?id=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vbmV3cy9yZWxlYXNlP2lkPTQyJmxhbmc9ZW4=',
    )

    expect(unwrapPrweb(url)).toBe('https://www.example.com/news/release?id=42&lang=en')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://www.prweb.net/Redirect.aspx?id=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=',
    )

    expect(unwrapPrweb(url)).toBeUndefined()
  })

  it('should return undefined for the click tracker without id', () => {
    const url = new URL('http://www.prweb.net/Redirect.aspx')

    expect(unwrapPrweb(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.prweb.net/releases/2016/10/prweb123.htm?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==',
    )

    expect(unwrapPrweb(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/Redirect.aspx?id=aHR0cDovL3d3dy5leGFtcGxlLmNvbQ==')

    expect(unwrapPrweb(url)).toBeUndefined()
  })
})
