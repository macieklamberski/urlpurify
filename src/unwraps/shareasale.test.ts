import { describe, expect, it } from 'bun:test'
import { unwrapShareasale } from './shareasale.js'

describe('unwrapShareasale', () => {
  it('should extract target from urllink param', () => {
    const value = new URL(
      'https://shareasale.com/r.cfm?b=12345&u=67890&m=42&urllink=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapShareasale(value)).toBe(expected)
  })

  it('should return undefined when urllink param is missing', () => {
    const value = new URL('https://shareasale.com/r.cfm?b=12345&u=67890')

    expect(unwrapShareasale(value)).toBeUndefined()
  })

  it('should return undefined for non-redirect ShareASale paths', () => {
    const value = new URL('https://shareasale.com/info?urllink=https%3A%2F%2Fexample.com')

    expect(unwrapShareasale(value)).toBeUndefined()
  })

  it('should return undefined for non-ShareASale hosts', () => {
    const value = new URL('https://example.com/r.cfm?urllink=https%3A%2F%2Fother.com')

    expect(unwrapShareasale(value)).toBeUndefined()
  })
})
