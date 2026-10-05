import { describe, expect, it } from 'bun:test'
import { unwrapZanox } from './zanox.js'

describe('unwrapZanox', () => {
  it('should extract a plain target from ULP param', () => {
    const url = new URL(
      'http://ad.zanox.com/ppc/?21233308C206645266T&ULP=http://www.example.com/biglietti.html',
    )

    expect(unwrapZanox(url)).toBe('http://www.example.com/biglietti.html')
  })

  it('should extract a percent-encoded target from ULP param', () => {
    const url = new URL(
      'http://ad.zanox.com/ppc/?44192279C427052594T&ULP=http%3A%2F%2Fwww.example.com%2Fa%2F%3Fi%3Dclick%26camp%3Ddeep',
    )

    expect(unwrapZanox(url)).toBe('http://www.example.com/a/?i=click&camp=deep')
  })

  it('should extract a bracketed target from ULP param', () => {
    const url = new URL(
      'http://ad.zanox.com/ppc/?28370017C93385665&ULP=[[http://www.example.com/rdirect.php?et=OWxa23]]',
    )

    expect(unwrapZanox(url)).toBe('http://www.example.com/rdirect.php?et=OWxa23')
  })

  it('should keep the query of a bracketed target in lowercase ulp param', () => {
    const url = new URL(
      'https://ad.zanox.com/ppc/?26893381C92561534&ulp=[[http://k.example.com/kack/1/?REMPLACE&kaAdgId=366109&kaRdt=http://www.example.org/prod.aspx?docid=1&cod=AFF]]',
    )

    expect(unwrapZanox(url)).toBe(
      'http://k.example.com/kack/1/?REMPLACE&kaAdgId=366109&kaRdt=http://www.example.org/prod.aspx?docid=1&cod=AFF',
    )
  })

  it('should extract a target between percent-encoded brackets', () => {
    const url = new URL(
      'https://ad.zanox.com/ppc/?32408060C1102912383&ulp=%5B%5Bhttps://www.example.com/shop/Papillon9%5D%5D',
    )

    expect(unwrapZanox(url)).toBe('https://www.example.com/shop/Papillon9')
  })

  it('should return undefined when ULP param is missing', () => {
    const url = new URL('http://ad.zanox.com/ppc/?35736271C705468567T')

    expect(unwrapZanox(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Zanox host', () => {
    const url = new URL('http://ad.zanox.com/tpv/?ULP=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapZanox(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/ppc/?21233308C206645266T&ULP=http://www.example.org/')

    expect(unwrapZanox(url)).toBeUndefined()
  })
})
