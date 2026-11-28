import { describe, expect, it } from 'bun:test'
import { unwrapGroupon } from './groupon.js'

describe('unwrapGroupon', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'http://tracking.groupon.com/r?tsToken=US_AFF_0_210055_1872499_0&url=https%3A%2F%2Fwww.example.com%2Fbiz%2Fideal-cheese-shop%3Fz%3Dskip',
    )
    const expected = 'https://www.example.com/biz/ideal-cheese-shop?z=skip'

    expect(unwrapGroupon(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://tracking.groupon.com/r?tsToken=US_AFF_0_210055_1872499_0')

    expect(unwrapGroupon(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Groupon host', () => {
    const value = new URL(
      'http://tracking.groupon.com/i?tsToken=US_AFF_0_210055_1872499_0&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapGroupon(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'http://example.com/r?tsToken=US_AFF_0&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapGroupon(value)).toBeUndefined()
  })
})
