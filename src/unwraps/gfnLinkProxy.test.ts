import { describe, expect, it } from 'bun:test'
import { unwrapGfnLinkProxy } from './gfnLinkProxy.js'

describe('unwrapGfnLinkProxy', () => {
  it('should extract target from base64 to param', () => {
    const url = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(url)).toBe('https://example.org/')
  })

  it('should extract target behind a forum prefix', () => {
    const url = new URL(
      'https://www.example.com/forum/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy9pLzFsZmp1WDJ3M0tCcU1T',
    )

    expect(unwrapGfnLinkProxy(url)).toBe('https://example.org/i/1lfjuX2w3KBqMS')
  })

  it('should extract an unpadded target', () => {
    const url = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy9hYg')

    expect(unwrapGfnLinkProxy(url)).toBe('https://example.org/ab')
  })

  it('should keep the query of the decoded target', () => {
    const url = new URL(
      'https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpP2xhbmc9cnUmcmVmPWE%3D',
    )

    expect(unwrapGfnLinkProxy(url)).toBe('https://example.org/wiki?lang=ru&ref=a')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://www.example.com/redirect/')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })

  it('should return undefined for a plain http to param', () => {
    const url = new URL('https://www.example.com/redirect/?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })

  it('should return undefined for a base64 non-http target', () => {
    const url = new URL('https://www.example.com/redirect/?to=amF2YXNjcmlwdDphbGVydCgxKQ%3D%3D')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL('https://www.example.com/redirect?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://www.example.com/yonlendirme/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })

  it('should return undefined for the path under two prefix segments', () => {
    const url = new URL('https://www.example.com/a/b/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapGfnLinkProxy(url)).toBeUndefined()
  })
})
