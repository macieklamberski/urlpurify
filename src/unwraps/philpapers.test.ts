import { describe, expect, it } from 'bun:test'
import { unwrapPhilpapers } from './philpapers.js'

describe('unwrapPhilpapers', () => {
  it('should extract the target from an outbound link', () => {
    const url = new URL(
      'https://philpapers.org/go.pl?id=WARWIB&proxyId=&u=https%3A%2F%2Fexample.com%2Fs%2FWIB.pdf',
    )

    expect(unwrapPhilpapers(url)).toBe('https://example.com/s/WIB.pdf')
  })

  it('should extract the target from an outbound link without proxyId', () => {
    const url = new URL(
      'http://philpapers.org/go.pl?id=WILCGH&u=http%3A%2F%2Fexample%2Ecom%2Farchive%2FWILCGH',
    )

    expect(unwrapPhilpapers(url)).toBe('http://example.com/archive/WILCGH')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://philpapers.org/go.pl?id=WARWIB&proxyId=&u=https%253A%252F%252Fdoi.example.org%252F10.1000%252F182',
    )

    expect(unwrapPhilpapers(url)).toBe('https://doi.example.org/10.1000/182')
  })

  it('should return undefined for an archive link without u', () => {
    const url = new URL('https://philpapers.org/go.pl?aid=SMAIPA')

    expect(unwrapPhilpapers(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://philpapers.org/rec/WARWIB?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapPhilpapers(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/go.pl?id=WARWIB&u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapPhilpapers(url)).toBeUndefined()
  })
})
