import { describe, expect, it } from 'bun:test'
import { unwrapCalendly } from './calendly.js'

describe('unwrapCalendly', () => {
  it('should extract target from q param', () => {
    const url = new URL('https://calendly.com/url?q=https%3A%2F%2Fexample.com%2Fprofile')

    expect(unwrapCalendly(url)).toBe('https://example.com/profile')
  })

  it('should extract target when signature params follow', () => {
    const url = new URL(
      'https://calendly.com/url?q=https%3A%2F%2Fwww.example.com%2Fin%2Fjane&user_uuid=EHBDH42NKFJNYTRI&stage=1&hmac=5b7a5c8a84f4207c262c293e30cbe77cdde77151ca34376c546807a7d9728724',
    )

    expect(unwrapCalendly(url)).toBe('https://www.example.com/in/jane')
  })

  it('should extract target when signature params come first', () => {
    const url = new URL(
      'https://calendly.com/url?hmac=0c25e35dd55a462fdac4215b5ad57f8673382581a19b95a871a41c4caddd07d4&q=https%3A%2F%2Fexample.com%2Fwatch%3Fv%3Dabc&stage=1&user_uuid=BDFALW6GAKFXY5OY',
    )

    expect(unwrapCalendly(url)).toBe('https://example.com/watch?v=abc')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://calendly.com/url?q=https://www.example.com/jane/&stage=1')

    expect(unwrapCalendly(url)).toBe('https://www.example.com/jane/')
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://www.calendly.com/url?q=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined when q param is missing', () => {
    const url = new URL('https://calendly.com/url?stage=1')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined when q param is empty', () => {
    const url = new URL('https://calendly.com/url?q=')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path carrying q', () => {
    const url = new URL('https://calendly.com/jane/30min?q=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for a path below url', () => {
    const url = new URL('https://calendly.com/url/more?q=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://example.com/url?q=https%3A%2F%2Fother.example.org%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplecalendly.com/url?q=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the domain', () => {
    const url = new URL('https://calendly.com.example.com/url?q=https%3A%2F%2Fexample.org%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })

  it('should return undefined for a host that swaps the dot', () => {
    const url = new URL('https://www.calendlyxcom/url?q=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCalendly(url)).toBeUndefined()
  })
})
