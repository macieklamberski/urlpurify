import { describe, expect, it } from 'bun:test'
import { unwrapEulerian } from './eulerian.js'

describe('unwrapEulerian', () => {
  it('should extract target from eurl param', () => {
    const url = new URL(
      'http://elr.sfr.fr/dynclick/sfr-fr/?eml-publisher=Ginger&eml-name=Email-Gestion&eemail=user@example.com&linkId=45&eurl=http%3A%2F%2Fwww.example.com%2Fbox-internet%2F%3Fsfrcpid%3Dt20_ecom_086_gg',
    )

    expect(unwrapEulerian(url)).toBe('http://www.example.com/box-internet/?sfrcpid=t20_ecom_086_gg')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'http://www.example.com/dynclick/sfr-fr/?eml-publisher=Ginger&eml-name=Email-Gestion&eemail=user@example.com&linkId=45&eurl=https%253A%252F%252Fexample.org%252Fpage',
    )

    expect(unwrapEulerian(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.com/dynclick/sfr-fr/?eml-publisher=Ginger&eml-name=Email-Gestion&eemail=user@example.com&linkId=45&eurl=https://example.org/search/a+b',
    )

    expect(unwrapEulerian(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://eultech.fnac.com/dynclick/fnac/?ept-publisher=cineserie&ept-name=ArticlesEdito&eseg-name=article&eseg-item=&eurl=https://www.example.com/a14138664/Blu-ray',
    )

    expect(unwrapEulerian(url)).toBe('https://www.example.com/a14138664/Blu-ray')
  })

  it('should extract a target with percent-encoded dots', () => {
    const url = new URL(
      'http://eultech.fnac.com/dynclick/fnac/?eseg-name=affilieID&eaf-publisher=AFFILINET&eurl=http%3A%2F%2Fwww%2Eexample%2Ecom%2FPot%2DBebe',
    )

    expect(unwrapEulerian(url)).toBe('http://www.example.com/Pot-Bebe')
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL(
      'https://ea.venta-unica.com/dynclick/venta-unica-es?esl-k=sem-google&eurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEulerian(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://eultech.fnac.com/dynclick/fnac/extra/?eurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEulerian(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL(
      'https://eultech.fnac.com/fr/dynclick/fnac/?eurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEulerian(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://eultech.fnac.com/dynclick/fnac/?eurl=javascript%3Aalert(1)')

    expect(unwrapEulerian(url)).toBeUndefined()
  })

  it('should return undefined when eurl param is missing', () => {
    const url = new URL('https://eultech.fnac.com/dynclick/fnac/?ept-publisher=cineserie')

    expect(unwrapEulerian(url)).toBeUndefined()
  })

  it('should return undefined when eurl param is empty', () => {
    const url = new URL('https://eultech.fnac.com/dynclick/fnac/?eurl=')

    expect(unwrapEulerian(url)).toBeUndefined()
  })
})
