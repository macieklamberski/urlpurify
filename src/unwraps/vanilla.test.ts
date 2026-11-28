import { describe, expect, it } from 'bun:test'
import { unwrapVanilla } from './vanilla.js'

describe('unwrapVanilla', () => {
  it('should extract target from target param', () => {
    const value = new URL(
      'https://forum.example.com/home/leaving?allowTrusted=1&target=https%3A%2F%2Fwiki.example.org%2FUbuntu_18.04',
    )
    const expected = 'https://wiki.example.org/Ubuntu_18.04'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/home/leaving?allowTrusted=1&target=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/home/leaving?allowTrusted=1&target=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should extract target behind a locale prefix', () => {
    const value = new URL(
      'https://community.example.com/en/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2F',
    )
    const expected = 'https://example.org/'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should extract target behind a locale and subcommunity prefix', () => {
    const value = new URL(
      'https://forums.example.com/en/madden-nfl/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2Fpatch-notes',
    )
    const expected = 'https://example.org/patch-notes'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should extract target from the capitalised Target param', () => {
    const value = new URL('http://www.example.com/forum/home/leaving?Target=https%3A//example.org')
    const expected = 'https://example.org'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'https://forum.example.com/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2Fdownload%3Fproduct%3D96485%26q%3Da%2520b',
    )
    const expected = 'https://example.org/download?product=96485&q=a%20b'

    expect(unwrapVanilla(value)).toBe(expected)
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL(
      'https://forum.example.com/home/leave?target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined for the path under three prefix segments', () => {
    const value = new URL(
      'https://forum.example.com/a/b/c/home/leaving?target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const value = new URL(
      'https://forum.example.com/home/leaving/confirm?target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://forum.example.com/home/leaving?target=javascript%3Aalert(1)')

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const value = new URL('https://forum.example.com/home/leaving?target=%2Fdiscussion%2F42')

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://forum.example.com/home/leaving?allowTrusted=1')

    expect(unwrapVanilla(value)).toBeUndefined()
  })

  it('should return undefined when target param is empty', () => {
    const value = new URL('https://forum.example.com/home/leaving?target=')

    expect(unwrapVanilla(value)).toBeUndefined()
  })
})
