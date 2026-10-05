import { describe, expect, it } from 'bun:test'
import { unwrapConvertiser } from './convertiser.js'

describe('unwrapConvertiser', () => {
  it('should extract target from deep_link param', () => {
    const url = new URL(
      'https://converti.se/click/9260cbf8-6924997b-312809b0/?deep_link=https%3A%2F%2Fwww.example.com%2Fp%2Fraczki-na-buty%3Fmc%3D9041573&sid=Raczki',
    )

    expect(unwrapConvertiser(url)).toBe('https://www.example.com/p/raczki-na-buty?mc=9041573')
  })

  it('should return undefined when deep_link param is missing', () => {
    const url = new URL('https://converti.se/click/9260cbf8-6924997b-312809b0/?sid=Raczki')

    expect(unwrapConvertiser(url)).toBeUndefined()
  })

  it('should return undefined for a click path without the trailing slash', () => {
    const url = new URL(
      'https://converti.se/click/9260cbf8-6924997b-312809b0?deep_link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapConvertiser(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Convertiser host', () => {
    const url = new URL('https://converti.se/click/?deep_link=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapConvertiser(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/click/9260cbf8-6924997b-312809b0/?deep_link=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapConvertiser(url)).toBeUndefined()
  })
})
