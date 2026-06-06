import { describe, expect, it } from 'bun:test'
import { unwrapSteamLinkfilter } from './steamLinkfilter.js'

describe('unwrapSteamLinkfilter', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://steamcommunity.com/linkfilter/?url=https%3A%2F%2Fexample.com%2Farticle',
    )

    expect(unwrapSteamLinkfilter(url)).toBe('https://example.com/article')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://steamcommunity.com/linkfilter/?other=value')

    expect(unwrapSteamLinkfilter(url)).toBeUndefined()
  })

  it('should return undefined for non-linkfilter Steam paths', () => {
    const url = new URL('https://steamcommunity.com/profile?url=https%3A%2F%2Fexample.com')

    expect(unwrapSteamLinkfilter(url)).toBeUndefined()
  })

  it('should return undefined for non-Steam hosts', () => {
    const url = new URL('https://example.com/linkfilter/?url=https%3A%2F%2Fother.com')

    expect(unwrapSteamLinkfilter(url)).toBeUndefined()
  })
})
