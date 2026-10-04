import { describe, expect, it } from 'bun:test'
import { unwrapSkimlinks } from './skimlinks.js'

describe('unwrapSkimlinks', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://go.skimresources.com/?id=12345&xs=1&url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapSkimlinks(url)).toBe('https://example.com/product')
  })

  it('should extract target from url param on the go.skimlinks.com host', () => {
    const url = new URL('http://go.skimlinks.com/?id=134451X1597621&xs=1&url=http://example.com')

    expect(unwrapSkimlinks(url)).toBe('http://example.com')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://go.skimresources.com/?id=12345&xs=1')

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should return undefined for non-Skimlinks hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://click.skimlinks.com/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapSkimlinks(url)).toBe('https://example.com/page')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://go.skimresources.com/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the domain name', () => {
    const url = new URL(
      'https://go.skimresources.com.example.com/?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const url = new URL('https://exampleskimlinks.com/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })
})
