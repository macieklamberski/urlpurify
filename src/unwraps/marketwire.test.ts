import { describe, expect, it } from 'bun:test'
import { unwrapMarketwire } from './marketwire.js'

describe('unwrapMarketwire', () => {
  it('should extract the target from a tracker link', () => {
    const value = new URL(
      'http://ctt.marketwire.com/?release=1138843&id=4539910&type=1&url=http%3a%2f%2fexample.com%2fproducts%2frtos.html',
    )
    const expected = 'http://example.com/products/rtos.html'

    expect(unwrapMarketwire(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://ctt.marketwire.com/?release=1311855&id=11848150&type=1&url=https%253a%252f%252fexample.com%252f',
    )
    const expected = 'https://example.com/'

    expect(unwrapMarketwire(value)).toBe(expected)
  })

  it('should return undefined when url is missing', () => {
    const value = new URL('http://ctt.marketwire.com/?release=1138843&id=4539910&type=1')

    expect(unwrapMarketwire(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://ctt.marketwire.com/release.do?release=1138843&url=http%3a%2f%2fexample.com%2f',
    )

    expect(unwrapMarketwire(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/?release=1138843&url=http%3a%2f%2fexample.org%2f')

    expect(unwrapMarketwire(value)).toBeUndefined()
  })
})
