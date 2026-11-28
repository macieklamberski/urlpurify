import { describe, expect, it } from 'bun:test'
import { unwrapSteamLinkfilter } from './steamLinkfilter.js'

describe('unwrapSteamLinkfilter', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://steamcommunity.com/linkfilter/?url=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapSteamLinkfilter(value)).toBe(expected)
  })

  it('should extract target from u param', () => {
    const value = new URL(
      'https://steamcommunity.com/linkfilter/?u=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapSteamLinkfilter(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://steamcommunity.com/linkfilter/?other=value')

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })

  it('should return undefined for non-linkfilter Steam paths', () => {
    const value = new URL('https://steamcommunity.com/profile?url=https%3A%2F%2Fexample.com')

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })

  it('should return undefined for u param on non-linkfilter Steam paths', () => {
    const value = new URL('https://steamcommunity.com/id/example?u=https%3A%2F%2Fexample.com')

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })

  it('should return undefined for non-Steam hosts', () => {
    const value = new URL('https://example.com/linkfilter/?url=https%3A%2F%2Fother.com')

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://store.steamcommunity.com/linkfilter/?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplesteamcommunity.com/linkfilter/?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSteamLinkfilter(value)).toBeUndefined()
  })
})
