import { describe, expect, it } from 'bun:test'
import { unwrapTradedoubler } from './tradedoubler.js'

describe('unwrapTradedoubler', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://clk.tradedoubler.com/click?p=12345&a=67890&url=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapTradedoubler(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://clk.tradedoubler.com/click?p=12345&a=67890')

    expect(unwrapTradedoubler(value)).toBeUndefined()
  })

  it('should return undefined for non-click paths', () => {
    const value = new URL('https://clk.tradedoubler.com/redirect?url=https%3A%2F%2Fexample.com')

    expect(unwrapTradedoubler(value)).toBeUndefined()
  })

  it('should return undefined for non-Tradedoubler hosts', () => {
    const value = new URL('https://example.com/click?url=https%3A%2F%2Fother.com')

    expect(unwrapTradedoubler(value)).toBeUndefined()
  })
})
