import { describe, expect, it } from 'bun:test'
import { unwrapEffiliation } from './effiliation.js'

describe('unwrapEffiliation', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://track.effiliation.com/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapEffiliation(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://track.effiliation.com/servlet/effi.redir?other=value')

    expect(unwrapEffiliation(value)).toBeUndefined()
  })

  it('should return undefined for non-effiliation hosts', () => {
    const value = new URL('https://example.com/servlet/effi.redir?url=https%3A%2F%2Fother.com')

    expect(unwrapEffiliation(value)).toBeUndefined()
  })

  it('should extract target from effi.product', () => {
    const value = new URL(
      'https://track.effiliation.com/servlet/effi.product?id_compteur=22637591&url=https%3A%2F%2Fexample.com%2Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapEffiliation(value)).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://track.effiliation.com/servlet/effi.other?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEffiliation(value)).toBeUndefined()
  })

  it('should return undefined for a servlet path with a prefix', () => {
    const value = new URL(
      'https://track.effiliation.com/x/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapEffiliation(value)).toBeUndefined()
  })

  it('should return undefined for a servlet path with a suffix', () => {
    const value = new URL(
      'https://track.effiliation.com/servlet/effi.redir.php?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapEffiliation(value)).toBeUndefined()
  })
})
