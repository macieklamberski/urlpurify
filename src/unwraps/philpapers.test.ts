import { describe, expect, it } from 'bun:test'
import { unwrapPhilpapers } from './philpapers.js'

describe('unwrapPhilpapers', () => {
  it('should extract the target from an outbound link', () => {
    const value = new URL(
      'https://philpapers.org/go.pl?id=WARWIB&proxyId=&u=https%3A%2F%2Fexample.com%2Fs%2FWIB.pdf',
    )
    const expected = 'https://example.com/s/WIB.pdf'

    expect(unwrapPhilpapers(value)).toBe(expected)
  })

  it('should extract the target from an outbound link without proxyId', () => {
    const value = new URL(
      'http://philpapers.org/go.pl?id=WILCGH&u=http%3A%2F%2Fexample%2Ecom%2Farchive%2FWILCGH',
    )
    const expected = 'http://example.com/archive/WILCGH'

    expect(unwrapPhilpapers(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://philpapers.org/go.pl?id=WARWIB&proxyId=&u=https%253A%252F%252Fdoi.example.org%252F10.1000%252F182',
    )
    const expected = 'https://doi.example.org/10.1000/182'

    expect(unwrapPhilpapers(value)).toBe(expected)
  })

  it('should return undefined for an archive link without u', () => {
    const value = new URL('https://philpapers.org/go.pl?aid=SMAIPA')

    expect(unwrapPhilpapers(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://philpapers.org/rec/WARWIB?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapPhilpapers(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/go.pl?id=WARWIB&u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapPhilpapers(value)).toBeUndefined()
  })
})
