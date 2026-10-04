import { describe, expect, it } from 'bun:test'
import { unwrapEffiliation } from './effiliation.js'

describe('unwrapEffiliation', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://track.effiliation.com/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapEffiliation(url)).toBe('https://example.com/product')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://track.effiliation.com/servlet/effi.redir?other=value')

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should return undefined for non-effiliation hosts', () => {
    const url = new URL('https://example.com/servlet/effi.redir?url=https%3A%2F%2Fother.com')

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should extract target from effi.product', () => {
    const url = new URL(
      'https://track.effiliation.com/servlet/effi.product?id_compteur=22637591&url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEffiliation(url)).toBe('https://example.com/page')
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL(
      'https://click.effiliation.com/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEffiliation(url)).toBe('https://example.com/page')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://track.effiliation.com/servlet/effi.other?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampleeffiliation.com/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a servlet path with a prefix', () => {
    const url = new URL(
      'https://track.effiliation.com/x/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a servlet path with a suffix', () => {
    const url = new URL(
      'https://track.effiliation.com/servlet/effi.redir.php?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapEffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with effiliation.com', () => {
    const url = new URL(
      'https://track.effiliation.com.example.net/servlet/effi.redir?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapEffiliation(url)).toBeUndefined()
  })
})
