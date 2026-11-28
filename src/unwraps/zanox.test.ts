import { describe, expect, it } from 'bun:test'
import { unwrapZanox } from './zanox.js'

describe('unwrapZanox', () => {
  it('should extract a plain target from ULP param', () => {
    const value = new URL(
      'http://ad.zanox.com/ppc/?21233308C206645266T&ULP=http://www.example.com/biglietti.html',
    )
    const expected = 'http://www.example.com/biglietti.html'

    expect(unwrapZanox(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from ULP param', () => {
    const value = new URL(
      'http://ad.zanox.com/ppc/?44192279C427052594T&ULP=http%3A%2F%2Fwww.example.com%2Fa%2F%3Fi%3Dclick%26camp%3Ddeep',
    )
    const expected = 'http://www.example.com/a/?i=click&camp=deep'

    expect(unwrapZanox(value)).toBe(expected)
  })

  it('should extract a bracketed target from ULP param', () => {
    const value = new URL(
      'http://ad.zanox.com/ppc/?28370017C93385665&ULP=[[http://www.example.com/rdirect.php?et=OWxa23]]',
    )
    const expected = 'http://www.example.com/rdirect.php?et=OWxa23'

    expect(unwrapZanox(value)).toBe(expected)
  })

  it('should keep the query of a bracketed target in lowercase ulp param', () => {
    const value = new URL(
      'https://ad.zanox.com/ppc/?26893381C92561534&ulp=[[http://k.example.com/kack/1/?REMPLACE&kaAdgId=366109&kaRdt=http://www.example.org/prod.aspx?docid=1&cod=AFF]]',
    )
    const expected =
      'http://k.example.com/kack/1/?REMPLACE&kaAdgId=366109&kaRdt=http://www.example.org/prod.aspx?docid=1&cod=AFF'

    expect(unwrapZanox(value)).toBe(expected)
  })

  it('should extract a target between percent-encoded brackets', () => {
    const value = new URL(
      'https://ad.zanox.com/ppc/?32408060C1102912383&ulp=%5B%5Bhttps://www.example.com/shop/Papillon9%5D%5D',
    )
    const expected = 'https://www.example.com/shop/Papillon9'

    expect(unwrapZanox(value)).toBe(expected)
  })

  it('should return undefined when ULP param is missing', () => {
    const value = new URL('http://ad.zanox.com/ppc/?35736271C705468567T')

    expect(unwrapZanox(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Zanox host', () => {
    const value = new URL('http://ad.zanox.com/tpv/?ULP=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapZanox(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/ppc/?21233308C206645266T&ULP=http://www.example.org/')

    expect(unwrapZanox(value)).toBeUndefined()
  })
})
