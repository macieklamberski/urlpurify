import { describe, expect, it } from 'bun:test'
import { unwrapBolPartner } from './bolPartner.js'

describe('unwrapBolPartner', () => {
  it('should extract target from url param on partner.bol.com', () => {
    const url = new URL(
      'https://partner.bol.com/click/click?p=2&t=url&s=37025&f=TXL&url=https%3A%2F%2Fexample.com%2Fnl%2Fc%2Flimberlux%2F18047672%2F&name=LimberLux%20artikelen',
    )

    expect(unwrapBolPartner(url)).toBe('https://example.com/nl/c/limberlux/18047672/')
  })

  it('should extract target from url param on partnerprogramma.bol.com', () => {
    const url = new URL(
      'https://partnerprogramma.bol.com/click/click?p=1&t=url&s=33477&f=TXL&url=https%3A%2F%2Fexample.com%2Fnl%2Fp%2Fvraag-en-het-wordt-gegeven%2F1001004002597176%2F&name=SoV&subid=youtube5',
    )

    expect(unwrapBolPartner(url)).toBe(
      'https://example.com/nl/p/vraag-en-het-wordt-gegeven/1001004002597176/',
    )
  })

  it('should extract target from url param on tracking.bol.com', () => {
    const url = new URL(
      'https://tracking.bol.com/click/click?p=1&t=url&s=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBolPartner(url)).toBe('https://example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://partner.bol.com/click/click?p=1&t=url&s=33477&f=TXL&url=https%3A%2F%2Fexample.com%2Fnl%2Fp%2F1001004002597176%2F%3FsuggestionType%3Dsearchhistory&name=SoV',
    )

    expect(unwrapBolPartner(url)).toBe(
      'https://example.com/nl/p/1001004002597176/?suggestionType=searchhistory',
    )
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://partnerprogramma.bol.com/click/click?p=1&t=url&s=8992&url=https://example.com/nl/p/fooled-by-randomness/1001004004873326/&f=TXL&name=Taleb_Misleid',
    )

    expect(unwrapBolPartner(url)).toBe(
      'https://example.com/nl/p/fooled-by-randomness/1001004004873326/',
    )
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL(
      'https://affiliate.bol.com/click/click?p=1&t=url&s=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBolPartner(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://partner.bol.com/click/click?p=2&t=url&s=1')

    expect(unwrapBolPartner(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://partner.bol.com/click/click?p=2&t=url&s=1&url=')

    expect(unwrapBolPartner(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the partner host', () => {
    const url = new URL(
      'https://partner.bol.com/click/other?p=2&t=url&s=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBolPartner(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://partner.symbol.com/click/click?p=2&t=url&s=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBolPartner(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains bol.com', () => {
    const url = new URL(
      'https://partner.bol.com.example.org/click/click?p=2&t=url&s=1&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBolPartner(url)).toBeUndefined()
  })
})
