import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapGoogleAmpViewer } from './googleAmpViewer.js'

describe('unwrapGoogleAmpViewer', () => {
  it('should extract https target from /amp/s/ path', () => {
    const value = new URL('https://www.google.com/amp/s/example.com/article')
    const expected = 'https://example.com/article'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should extract http target from /amp/ path without s/', () => {
    const value = new URL('https://www.google.com/amp/example.com/article')
    const expected = 'http://example.com/article'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should accept google.de host', () => {
    const value = new URL('https://www.google.de/amp/s/example.com/article')
    const expected = 'https://example.com/article'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should accept google.com without www subdomain', () => {
    const value = new URL('https://google.com/amp/s/example.com/article')
    const expected = 'https://example.com/article'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should preserve nested path segments', () => {
    const value = new URL('https://www.google.com/amp/s/example.com/section/sub/article?id=42')
    const expected = 'https://example.com/section/sub/article?id=42'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should keep the target query string on the http variant', () => {
    const value = new URL('https://www.google.com/amp/example.com/article.php?id=5')
    const expected = 'http://example.com/article.php?id=5'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should decode a target query encoded into the path', () => {
    const value = new URL('https://www.google.com/amp/s/example.com/news/article%3fampMode=1')
    const expected = 'https://example.com/news/article?ampMode=1'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should decode a target query encoded into the path on the http variant', () => {
    const value = new URL('https://www.google.com/amp/example.com/vinegar/%3Famp')
    const expected = 'http://example.com/vinegar/?amp'

    expect(unwrapGoogleAmpViewer(value)).toBe(expected)
  })

  it('should return undefined for non-/amp/ paths', () => {
    const value = new URL('https://www.google.com/search?q=test')

    expect(unwrapGoogleAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for non-Google hosts', () => {
    const value = new URL('https://example.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://m.google.co.uk/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplegoogle.com/amp/s/example.com/article')

    expect(unwrapGoogleAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a google domain', () => {
    const value = new URL('https://www.google.com.example.net/amp/s/example.com/page')

    expect(unwrapGoogleAmpViewer(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapGoogleAmpViewer)).toBe(true)
  })
})
