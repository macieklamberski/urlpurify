import { describe, expect, it } from 'bun:test'
import { unwrapUinterbox } from './uinterbox.js'

describe('unwrapUinterbox', () => {
  it('should extract a plain target from url param', () => {
    const url = new URL(
      'https://afiliadoscasadellibro.uinterbox.com/tracking/clk?act=573&gel=3245&pub=1636&org=205&url=https://www.example.com/libro-la-revolucion-haitiana/9788446031789/2088770',
    )

    expect(unwrapUinterbox(url)).toBe(
      'https://www.example.com/libro-la-revolucion-haitiana/9788446031789/2088770',
    )
  })

  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'https://afiliadoscasadellibro.uinterbox.com/tracking/clk?fid=4&act=573&gel=0&pub=7763&org=205&url=https%3A%2F%2Fwww.example.com%2FhomeAfiliado%3Fca%3D57581%26idproducto%3D10102294',
    )

    expect(unwrapUinterbox(url)).toBe(
      'https://www.example.com/homeAfiliado?ca=57581&idproducto=10102294',
    )
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://afiliadoscasadellibro.uinterbox.com/tracking/clk?act=573&pub=1636')

    expect(unwrapUinterbox(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Uinterbox host', () => {
    const url = new URL(
      'https://afiliadoscasadellibro.uinterbox.com/tracking/imp?act=573&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapUinterbox(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/tracking/clk?act=573&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapUinterbox(url)).toBeUndefined()
  })
})
