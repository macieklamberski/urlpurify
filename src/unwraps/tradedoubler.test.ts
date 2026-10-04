import { describe, expect, it } from 'bun:test'
import { unwrapTradedoubler } from './tradedoubler.js'

describe('unwrapTradedoubler', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://clk.tradedoubler.com/click?p=12345&a=67890&url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapTradedoubler(url)).toBe('https://example.com/product')
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

  it('should extract target on the clkuk host', () => {
    const url = new URL(
      'https://clkuk.tradedoubler.com/click?p=1&a=2&url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapTradedoubler(url)).toBe('https://example.com/page')
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(
      'https://clkfr.tradedoubler.com/click?p=1&url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapTradedoubler(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampletradedoubler.com/click?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapTradedoubler(url)).toBeUndefined()
  })
})
