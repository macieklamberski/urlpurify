import { describe, expect, it } from 'bun:test'
import { unwrapPrNewswire } from './prNewswire.js'

describe('unwrapPrNewswire', () => {
  it('should extract target from a c212.net link', () => {
    const url = new URL(
      'https://c212.net/c/link/?t=0&l=en&o=4294123-1&h=1520464370&u=https%3A%2F%2Fexample.com%2F%3Futm_source%3Dpressrelease&a=example.com',
    )

    expect(unwrapPrNewswire(url)).toBe('https://example.com/?utm_source=pressrelease')
  })

  it('should extract target from an edge.prnewswire.com link', () => {
    const url = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&l=en&o=4706875-1&h=2672565664&u=https%3A%2F%2Fexample.com%2Fproducts&a=Example',
    )

    expect(unwrapPrNewswire(url)).toBe('https://example.com/products')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&l=en&o=4630040-1&h=1174090750&u=http%253A%252F%252Fexample.com%252F&a=Example',
    )

    expect(unwrapPrNewswire(url)).toBe('http://example.com/')
  })

  it('should extract an uppercase twice-encoded target', () => {
    const url = new URL('https://c212.net/c/link/?t=0&u=HTTPS%253A%252F%252Fexample.com%252F')

    expect(unwrapPrNewswire(url)).toBe('HTTPS://example.com/')
  })

  it('should extract the last target when a tracker is nested unencoded', () => {
    const url = new URL(
      'https://c212.net/c/link/?t=0&l=en&o=3351776-1&h=3653965204&u=https://c212.net/c/link/?t=0&l=en&o=2975775-1&h=3055853517&u=https%253A%252F%252Fexample.com%252F&a=Pet+Poison+Helpline&a=Pet+Poison+Helpline',
    )

    expect(unwrapPrNewswire(url)).toBe('https://example.com/')
  })

  it('should return a nested PR Newswire link for the next unwrap pass', () => {
    const url = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&l=en&o=4575016-1&h=122021973&u=https%3A%2F%2Fc212.net%2Fc%2Flink%2F%3Ft%3D0%26u%3Dhttps%253A%252F%252Fexample.com%252F',
    )

    expect(unwrapPrNewswire(url)).toBe(
      'https://c212.net/c/link/?t=0&u=https%3A%2F%2Fexample.com%2F',
    )
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://c212.net/c/link/?t=0&l=en&o=4294123-1&h=1520464370')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://c212.net/c/link/?t=0&u=javascript%3Aalert(1)')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a malformed twice-encoded target', () => {
    const url = new URL('https://c212.net/c/link/?t=0&u=https%253A%252F%252Fexample.com%25')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL('https://c212.net/i/link/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a release page on the tracker host', () => {
    const url = new URL(
      'https://edge.prnewswire.com/news-releases/x.html?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/c/link/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://www.prnewswire.com/c/link/?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplec212.net/c/link/?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapPrNewswire(url)).toBeUndefined()
  })
})
