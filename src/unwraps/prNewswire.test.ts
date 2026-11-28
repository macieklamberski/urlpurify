import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapPrNewswire } from './prNewswire.js'

describe('unwrapPrNewswire', () => {
  it('should extract target from a c212.net link', () => {
    const value = new URL(
      'https://c212.net/c/link/?t=0&l=en&o=4294123-1&h=1520464370&u=https%3A%2F%2Fexample.com%2F%3Futm_source%3Dpressrelease&a=example.com',
    )
    const expected = 'https://example.com/?utm_source=pressrelease'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://c212.net/c/link/?t=0&l=en&o=4294123-1&h=1520464370&u=https://example.org/search/a+b&a=example.com',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&l=en&o=4630040-1&h=1174090750&u=http%253A%252F%252Fexample.com%252F&a=Example',
    )
    const expected = 'http://example.com/'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&u=http%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'http://example.com/100%'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should extract an uppercase twice-encoded target', () => {
    const value = new URL('https://c212.net/c/link/?t=0&u=HTTPS%253A%252F%252Fexample.com%252F')
    const expected = 'HTTPS://example.com/'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should extract the last target when a tracker is nested unencoded', () => {
    const value = new URL(
      'https://c212.net/c/link/?t=0&l=en&o=3351776-1&h=3653965204&u=https://c212.net/c/link/?t=0&l=en&o=2975775-1&h=3055853517&u=https%253A%252F%252Fexample.com%252F&a=Pet+Poison+Helpline&a=Pet+Poison+Helpline',
    )
    const expected = 'https://example.com/'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should return a nested PR Newswire link for the next unwrap pass', () => {
    const value = new URL(
      'https://edge.prnewswire.com/c/link/?t=0&l=en&o=4575016-1&h=122021973&u=https%3A%2F%2Fc212.net%2Fc%2Flink%2F%3Ft%3D0%26u%3Dhttps%253A%252F%252Fexample.com%252F',
    )
    const expected = 'https://c212.net/c/link/?t=0&u=https%3A%2F%2Fexample.com%2F'

    expect(unwrapPrNewswire(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://c212.net/c/link/?t=0&l=en&o=4294123-1&h=1520464370')

    expect(unwrapPrNewswire(value)).toBeUndefined()
  })

  it('should keep the link for a non-http target', () => {
    const value = 'https://c212.net/c/link/?t=0&u=javascript%3Aalert(1)'
    const expected = 'https://c212.net/c/link/?t=0&u=javascript%3Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapPrNewswire] })).toBe(expected)
  })

  it('should keep the link for a malformed twice-encoded target', () => {
    const value = 'https://c212.net/c/link/?t=0&u=https%253A%252F%252Fexample.com%25'
    const expected = 'https://c212.net/c/link/?t=0&u=https%253A%252F%252Fexample.com%25'

    expect(purifyUrl(value, { unwrappers: [unwrapPrNewswire] })).toBe(expected)
  })

  it('should return undefined for other paths on the tracker host', () => {
    const value = new URL('https://c212.net/i/link/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapPrNewswire(value)).toBeUndefined()
  })

  it('should return undefined for a release page on the tracker host', () => {
    const value = new URL(
      'https://edge.prnewswire.com/news-releases/x.html?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPrNewswire(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/c/link/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapPrNewswire(value)).toBeUndefined()
  })
})
