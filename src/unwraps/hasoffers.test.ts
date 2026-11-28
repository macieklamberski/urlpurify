import { describe, expect, it } from 'bun:test'
import { unwrapHasoffers } from './hasoffers.js'

describe('unwrapHasoffers', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://bukalapak.go2cloud.org/aff_c?offer_id=15&aff_id=9561&url=https%3A%2F%2Fwww.example.com%2Fproducts%3Futf8%3D%E2%9C%93%26source%3Dnavbar',
    )
    const expected = 'https://www.example.com/products?utf8=✓&source=navbar'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/aff_c?offer_id=15&aff_id=9561&url=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/aff_c?offer_id=15&aff_id=9561&url=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'http://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=https://blog.example.com/incense-recipe',
    )
    const expected = 'https://blog.example.com/incense-recipe'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should extract target on a network tracking host', () => {
    const value = new URL(
      'https://go.thrv.me/aff_c?offer_id=6&aff_id=4996&url=https%3A%2F%2Fwww.example.com%2Fmorsels-dark',
    )
    const expected = 'https://www.example.com/morsels-dark'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should keep the macros the network fills in', () => {
    const value = new URL(
      'https://click.jrpass.com/aff_c?aff_id=278&offer_id=19&url=https%3A%2F%2Fwww.example.com%2Ffarecalculator%3Ftrans%3D%7Btransaction_id%7D%26offer_id%3D%7Boffer_id%7D',
    )
    const expected =
      'https://www.example.com/farecalculator?trans={transaction_id}&offer_id={offer_id}'

    expect(unwrapHasoffers(value)).toBe(expected)
  })

  it('should return undefined for the impression pixel path', () => {
    const value = new URL(
      'https://aspireiq.go2cloud.org/aff_i?offer_id=24&aff_id=6110&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const value = new URL(
      'https://www.example.net/out/aff_c?offer_id=24&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined without offer_id', () => {
    const value = new URL('https://www.example.net/aff_c?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined for a url held in a sub-id param', () => {
    const value = new URL(
      'http://voxmediapartner.go2cloud.org/aff_c?offer_id=2&aff_id=1&aff_sub=Verge&aff_unique1=https://www.example.com/series',
    )

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=javascript%3Aalert(1)',
    )

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110')

    expect(unwrapHasoffers(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://aspireiq.go2cloud.org/aff_c?offer_id=24&aff_id=6110&url=')

    expect(unwrapHasoffers(value)).toBeUndefined()
  })
})
