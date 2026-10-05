import { describe, expect, it } from 'bun:test'
import { unwrapTradetracker } from './tradetracker.js'

describe('unwrapTradetracker', () => {
  it('should extract a plain target from u', () => {
    const url = new URL(
      'https://tc.tradetracker.net/?c=15716&m=12&a=397377&r=2822923&u=https://example.com/item/1005010721439865.html',
    )

    expect(unwrapTradetracker(url)).toBe('https://example.com/item/1005010721439865.html')
  })

  it('should extract a percent-encoded target from u', () => {
    const url = new URL(
      'http://tc.tradetracker.net/?c=2012&m=12&a=228621&u=https%3A%2F%2Fexample.com%2Fcoldcream-30ml-p-64044.html',
    )

    expect(unwrapTradetracker(url)).toBe('https://example.com/coldcream-30ml-p-64044.html')
  })

  it('should return undefined when u is empty', () => {
    const url = new URL('https://tc.tradetracker.net/?c=1&m=1&a=1&r=x&u=')

    expect(unwrapTradetracker(url)).toBeUndefined()
  })

  it('should return undefined for u on another path', () => {
    const url = new URL('https://tc.tradetracker.net/click?u=https%3A%2F%2Fexample.com')

    expect(unwrapTradetracker(url)).toBeUndefined()
  })

  it('should return undefined for the shape on a non-TradeTracker host', () => {
    const url = new URL('https://example.com/?c=1&m=12&a=1&u=https%3A%2F%2Fexample.org')

    expect(unwrapTradetracker(url)).toBeUndefined()
  })
})
