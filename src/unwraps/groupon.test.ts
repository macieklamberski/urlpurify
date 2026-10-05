import { describe, expect, it } from 'bun:test'
import { unwrapGroupon } from './groupon.js'

describe('unwrapGroupon', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://tracking.groupon.com/r?tsToken=US_AFF_0_210055_1872499_0&url=https%3A%2F%2Fwww.example.com%2Fbiz%2Fideal-cheese-shop%3Fz%3Dskip',
    )

    expect(unwrapGroupon(url)).toBe('https://www.example.com/biz/ideal-cheese-shop?z=skip')
  })

  it('should extract target from url param on a country host', () => {
    const url = new URL(
      'http://t.groupon.co.il/r?tsToken=IL_AFF_0_208774_841221_0&url=https%3A%2F%2Fwww.example.com%2Fdeals%2Fmerchant-0-11305900526-7&wid=http://www.example.org',
    )

    expect(unwrapGroupon(url)).toBe('https://www.example.com/deals/merchant-0-11305900526-7')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://tracking.groupon.com/r?tsToken=US_AFF_0_210055_1872499_0')

    expect(unwrapGroupon(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Groupon host', () => {
    const url = new URL(
      'http://tracking.groupon.com/i?tsToken=US_AFF_0_210055_1872499_0&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapGroupon(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/r?tsToken=US_AFF_0&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapGroupon(url)).toBeUndefined()
  })
})
