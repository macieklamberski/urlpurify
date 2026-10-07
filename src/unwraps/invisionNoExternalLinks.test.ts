import { describe, expect, it } from 'bun:test'
import { unwrapInvisionNoExternalLinks } from './invisionNoExternalLinks.js'

describe('unwrapInvisionNoExternalLinks', () => {
  it('should extract target from to param', () => {
    const url = new URL(
      'https://www.example.com/redirect/?to=https://www.example.org/scooters/xciting-vs-400',
    )

    expect(unwrapInvisionNoExternalLinks(url)).toBe(
      'https://www.example.org/scooters/xciting-vs-400',
    )
  })

  it('should extract a percent-encoded target', () => {
    const url = new URL('https://forum.example.com/redirect/?to=https%3A%2F%2Fexample.org%2Fa%2F')

    expect(unwrapInvisionNoExternalLinks(url)).toBe('https://example.org/a/')
  })

  it('should extract target behind a prefix', () => {
    const url = new URL('https://www.example.com/en/redirect/?to=http://www.example.org/')

    expect(unwrapInvisionNoExternalLinks(url)).toBe('http://www.example.org/')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL('https://www.example.com/redirect/?to=https://example.org/a+b/')

    expect(unwrapInvisionNoExternalLinks(url)).toBe('https://example.org/a+b/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.com/redirect/?to=https%253A%252F%252Fexample.org%252Fa%252F',
    )

    expect(unwrapInvisionNoExternalLinks(url)).toBe('https://example.org/a/')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'https://www.example.com/redirect/?to=https%253A%252F%252Fexample.org%252F100%25',
    )

    expect(unwrapInvisionNoExternalLinks(url)).toBe('https://example.org/100%')
  })

  it('should extract the first to param', () => {
    const url = new URL(
      'https://www.example.com/redirect/?to=https%3A%2F%2Fexample.org%2F&to=https%3A%2F%2Fexample.net%2F',
    )

    expect(unwrapInvisionNoExternalLinks(url)).toBe('https://example.org/')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://www.example.com/redirect/')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })

  it('should return undefined for a base64 to param', () => {
    const url = new URL('https://www.example.com/redirect/?to=aHR0cHM6Ly9leGFtcGxlLm9yZy8%3D')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL('https://www.example.com/redirect?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://www.example.com/redirect-to/?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })

  it('should return undefined for a path that continues after redirect/', () => {
    const url = new URL('https://www.example.com/redirect/x?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })

  it('should return undefined for the path under two prefix segments', () => {
    const url = new URL('https://www.example.com/a/b/redirect/?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapInvisionNoExternalLinks(url)).toBeUndefined()
  })
})
