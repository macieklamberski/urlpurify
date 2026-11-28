import { describe, expect, it } from 'bun:test'
import { unwrapVbulletin } from './vbulletin.js'

describe('unwrapVbulletin', () => {
  it('should extract target from redirect param', () => {
    const value = new URL(
      'https://www.example.com/redirect-to/?redirect=http%3A%2F%2Fwww.example.org%2Fdownloads%2Fpdf%2Bbekijken',
    )
    const expected = 'http://www.example.org/downloads/pdf+bekijken'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/redirect-to/?redirect=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/redirect-to/?redirect=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should extract target behind a forum prefix', () => {
    const value = new URL(
      'https://www.example.com/forums/redirect-to/?redirect=https%3A%2F%2Fwww.example.org%2Fclass.html',
    )
    const expected = 'https://www.example.org/class.html'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('http://www.example.com/forum/redirect-to/?redirect=https://example.org/')
    const expected = 'https://example.org/'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'https://www.example.com/redirect-to/?redirect=https%3A%2F%2Fexample.org%2Faddon%2F%3Fsrc%3Dss%26q%3Da%2520b',
    )
    const expected = 'https://example.org/addon/?src=ss&q=a%20b'

    expect(unwrapVbulletin(value)).toBe(expected)
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL(
      'https://www.example.com/redirect-to-url/?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const value = new URL(
      'https://www.example.com/redirect-to?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined for the path under two prefix segments', () => {
    const value = new URL(
      'https://www.example.com/a/b/redirect-to/?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const value = new URL(
      'https://www.example.com/redirect-to/index.php?redirect=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://www.example.com/redirect-to/?redirect=javascript%3Aalert(1)')

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const value = new URL('https://www.example.com/redirect-to/?redirect=%2Fforum%2Fthread%2F42')

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined when redirect param is missing', () => {
    const value = new URL('https://www.example.com/redirect-to/?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapVbulletin(value)).toBeUndefined()
  })

  it('should return undefined when redirect param is empty', () => {
    const value = new URL('https://www.example.com/redirect-to/?redirect=')

    expect(unwrapVbulletin(value)).toBeUndefined()
  })
})
