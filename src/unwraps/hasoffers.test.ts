import { describe, expect, it } from 'bun:test'
import { unwrapHasoffers } from './hasoffers.js'

describe('unwrapHasoffers', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://bukalapak.go2cloud.org/aff_c?offer_id=15&aff_id=9561&url=https%3A%2F%2Fwww.example.com%2Fproducts%3Futf8%3D%E2%9C%93%26source%3Dnavbar',
    )

    expect(unwrapHasoffers(url)).toBe('https://www.example.com/products?utf8=✓&source=navbar')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=https://blog.example.com/incense-recipe',
    )

    expect(unwrapHasoffers(url)).toBe('https://blog.example.com/incense-recipe')
  })

  it('should extract target on a network tracking host', () => {
    const url = new URL(
      'https://go.thrv.me/aff_c?offer_id=6&aff_id=4996&url=https%3A%2F%2Fwww.example.com%2Fmorsels-dark',
    )

    expect(unwrapHasoffers(url)).toBe('https://www.example.com/morsels-dark')
  })

  it('should keep the macros the network fills in', () => {
    const url = new URL(
      'https://click.jrpass.com/aff_c?aff_id=278&offer_id=19&url=https%3A%2F%2Fwww.example.com%2Ffarecalculator%3Ftrans%3D%7Btransaction_id%7D%26offer_id%3D%7Boffer_id%7D',
    )

    expect(unwrapHasoffers(url)).toBe(
      'https://www.example.com/farecalculator?trans={transaction_id}&offer_id={offer_id}',
    )
  })

  it('should return undefined for the impression pixel path', () => {
    const url = new URL(
      'https://aspireiq.go2cloud.org/aff_i?offer_id=24&aff_id=6110&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL(
      'https://www.example.net/out/aff_c?offer_id=24&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined without offer_id', () => {
    const url = new URL('https://www.example.net/aff_c?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined for a url held in a sub-id param', () => {
    const url = new URL(
      'http://voxmediapartner.go2cloud.org/aff_c?offer_id=2&aff_id=1&aff_sub=Verge&aff_unique1=https://www.example.com/series',
    )

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=javascript%3Aalert(1)',
    )

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110')

    expect(unwrapHasoffers(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=')

    expect(unwrapHasoffers(url)).toBeUndefined()
  })
})
