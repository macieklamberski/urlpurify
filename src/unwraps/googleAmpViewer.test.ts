import { describe, expect, it } from 'bun:test'
import { unwrapGoogleAmpViewer } from './googleAmpViewer.js'

describe('unwrapGoogleAmpViewer', () => {
  it('should extract https target from /amp/s/ path', () => {
    const url = new URL('https://www.google.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBe('https://example.com/article')
  })

  it('should extract http target from /amp/ path without s/', () => {
    const url = new URL('https://www.google.com/amp/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBe('http://example.com/article')
  })

  it('should accept google.de host', () => {
    const url = new URL('https://www.google.de/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBe('https://example.com/article')
  })

  it('should accept google.com without www subdomain', () => {
    const url = new URL('https://google.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBe('https://example.com/article')
  })

  it('should preserve nested path segments', () => {
    const url = new URL('https://www.google.com/amp/s/example.com/section/sub/article?id=42')

    expect(unwrapGoogleAmpViewer(url)).toBe('https://example.com/section/sub/article?id=42')
  })

  it('should keep the target query string on the http variant', () => {
    const url = new URL('https://www.google.com/amp/example.com/article.php?id=5')

    expect(unwrapGoogleAmpViewer(url)).toBe('http://example.com/article.php?id=5')
  })

  it('should return undefined for non-/amp/ paths', () => {
    const url = new URL('https://www.google.com/search?q=test')

    expect(unwrapGoogleAmpViewer(url)).toBeUndefined()
  })

  it('should return undefined for non-Google hosts', () => {
    const url = new URL('https://example.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBeUndefined()
  })

  it('should extract https target from a subdomain no specimen shows', () => {
    const url = new URL('https://m.google.co.uk/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBe('https://example.com/article')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplegoogle.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(url)).toBeUndefined()
  })
})
