import { describe, expect, it } from 'bun:test'
import { unwrapVbulletin } from './vbulletin.js'

describe('unwrapVbulletin', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://www.example.com/redirect-to/?redirect=http%3A%2F%2Fwww.example.org%2Fdownloads%2Fpdf%2Bbekijken',
    )

    expect(unwrapVbulletin(url)).toBe('http://www.example.org/downloads/pdf+bekijken')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/redirect-to/?redirect=https://example.org/search/a+b',
    )

    expect(unwrapVbulletin(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target behind a forum prefix', () => {
    const url = new URL(
      'https://www.example.com/forums/redirect-to/?redirect=https%3A%2F%2Fwww.example.org%2Fclass.html',
    )

    expect(unwrapVbulletin(url)).toBe('https://www.example.org/class.html')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('http://www.example.com/forum/redirect-to/?redirect=https://example.org/')

    expect(unwrapVbulletin(url)).toBe('https://example.org/')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://www.example.com/redirect-to/?redirect=https%3A%2F%2Fexample.org%2Faddon%2F%3Fsrc%3Dss%26q%3Da%2520b',
    )

    expect(unwrapVbulletin(url)).toBe('https://example.org/addon/?src=ss&q=a%20b')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL(
      'https://www.example.com/redirect-to-url/?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL('https://www.example.com/redirect-to?redirect=https%3A%2F%2Fexample.org%2F')

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined for the path under two prefix segments', () => {
    const url = new URL(
      'https://www.example.com/a/b/redirect-to/?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const url = new URL(
      'https://www.example.com/redirect-to/index.php?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://www.example.com/redirect-to/?redirect=javascript%3Aalert(1)')

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const url = new URL('https://www.example.com/redirect-to/?redirect=%2Fforum%2Fthread%2F42')

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL('https://www.example.com/redirect-to/?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapVbulletin(url)).toBeUndefined()
  })

  it('should return undefined when redirect param is empty', () => {
    const url = new URL('https://www.example.com/redirect-to/?redirect=')

    expect(unwrapVbulletin(url)).toBeUndefined()
  })
})
