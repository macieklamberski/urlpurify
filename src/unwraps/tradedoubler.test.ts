import { describe, expect, it } from 'bun:test'
import { unwrapTradedoubler } from './tradedoubler.js'

describe('unwrapTradedoubler', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://clk.tradedoubler.com/click?p=12345&a=67890&url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapTradedoubler(url)).toBe('https://example.com/product')
  })

  it('should extract target from url param after an empty url param', () => {
    const url = new URL(
      'http://clk.tradedoubler.com/click?p=23762&a=3185&g=16287266&url=&url=http://example.com/WebObjects/viewIMix?id=281526280',
    )

    expect(unwrapTradedoubler(url)).toBe('http://example.com/WebObjects/viewIMix?id=281526280')
  })

  it('should extract target from the first url param when two are set', () => {
    const url = new URL(
      'https://clk.tradedoubler.com/click?p=362&a=3165083&url=https://example.com/bok/9789189526143/&url=https://example.org/',
    )

    expect(unwrapTradedoubler(url)).toBe('https://example.com/bok/9789189526143/')
  })

  it('should return undefined when every url param is empty', () => {
    const url = new URL('http://clk.tradedoubler.com/click?p=23762&a=3185&url=&url=')

    expect(unwrapTradedoubler(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://clk.tradedoubler.com/click?p=12345&a=67890')

    expect(unwrapTradedoubler(url)).toBeUndefined()
  })

  it('should return undefined for non-click paths', () => {
    const url = new URL('https://clk.tradedoubler.com/redirect?url=https%3A%2F%2Fexample.com')

    expect(unwrapTradedoubler(url)).toBeUndefined()
  })

  it('should return undefined for non-Tradedoubler hosts', () => {
    const url = new URL('https://example.com/click?url=https%3A%2F%2Fother.com')

    expect(unwrapTradedoubler(url)).toBeUndefined()
  })
})
