import { describe, expect, it } from 'bun:test'
import { unwrapGfnLinkProxy } from './gfnLinkProxy.js'

describe('unwrapGfnLinkProxy', () => {
  it('should extract target from base64 to param', () => {
    const value = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')
    const expected = 'https://example.org/'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })

  it('should extract target behind a forum prefix', () => {
    const value = new URL(
      'https://www.example.com/forum/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy9pLzFsZmp1WDJ3M0tCcU1T',
    )
    const expected = 'https://example.org/i/1lfjuX2w3KBqMS'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })

  it('should extract an unpadded target', () => {
    const value = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy9hYg')
    const expected = 'https://example.org/ab'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })

  it('should keep the query of the decoded target', () => {
    const value = new URL(
      'https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpP2xhbmc9cnUmcmVmPWE%3D',
    )
    const expected = 'https://example.org/wiki?lang=ru&ref=a'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })

  it('should return undefined when to param is missing', () => {
    const value = new URL('https://www.example.com/redirect/')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should return undefined for a plain http to param', () => {
    const value = new URL('https://www.example.com/redirect/?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should return undefined for a base64 non-http target', () => {
    const value = new URL('https://www.example.com/redirect/?to=amF2YXNjcmlwdDphbGVydCgxKQ%3D%3D')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should extract target from the path without the trailing slash', () => {
    const value = new URL('https://www.example.com/redirect?to=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcv')
    const expected = 'https://www.example.org/'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL('https://www.example.com/yonlendirme/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should return undefined for a path that continues after redirect', () => {
    const value = new URL('https://www.example.com/redirect/x?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should return undefined for the path under two prefix segments', () => {
    const value = new URL('https://www.example.com/a/b/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8jdG9w')
    const expected = 'https://example.org/#top'

    expect(unwrapGfnLinkProxy(value)).toBe(expected)
  })
})
