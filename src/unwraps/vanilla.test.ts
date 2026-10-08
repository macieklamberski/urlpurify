import { describe, expect, it } from 'bun:test'
import { unwrapVanilla } from './vanilla.js'

describe('unwrapVanilla', () => {
  it('should extract target from target param', () => {
    const url = new URL(
      'https://forum.example.com/home/leaving?allowTrusted=1&target=https%3A%2F%2Fwiki.example.org%2FUbuntu_18.04',
    )

    expect(unwrapVanilla(url)).toBe('https://wiki.example.org/Ubuntu_18.04')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/home/leaving?allowTrusted=1&target=https://example.org/search/a+b',
    )

    expect(unwrapVanilla(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target behind a locale prefix', () => {
    const url = new URL(
      'https://community.example.com/en/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(url)).toBe('https://example.org/')
  })

  it('should extract target behind a locale and subcommunity prefix', () => {
    const url = new URL(
      'https://forums.example.com/en/madden-nfl/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2Fpatch-notes',
    )

    expect(unwrapVanilla(url)).toBe('https://example.org/patch-notes')
  })

  it('should extract target from the capitalised Target param', () => {
    const url = new URL('http://www.example.com/forum/home/leaving?Target=https%3A//example.org')

    expect(unwrapVanilla(url)).toBe('https://example.org')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://forum.example.com/home/leaving?allowTrusted=1&target=https%3A%2F%2Fexample.org%2Fdownload%3Fproduct%3D96485%26q%3Da%2520b',
    )

    expect(unwrapVanilla(url)).toBe('https://example.org/download?product=96485&q=a%20b')
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://forum.example.com/home/leave?target=https%3A%2F%2Fexample.org%2F')

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined for the path under three prefix segments', () => {
    const url = new URL(
      'https://forum.example.com/a/b/c/home/leaving?target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const url = new URL(
      'https://forum.example.com/home/leaving/confirm?target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://forum.example.com/home/leaving?target=javascript%3Aalert(1)')

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const url = new URL('https://forum.example.com/home/leaving?target=%2Fdiscussion%2F42')

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://forum.example.com/home/leaving?allowTrusted=1')

    expect(unwrapVanilla(url)).toBeUndefined()
  })

  it('should return undefined when target param is empty', () => {
    const url = new URL('https://forum.example.com/home/leaving?target=')

    expect(unwrapVanilla(url)).toBeUndefined()
  })
})
