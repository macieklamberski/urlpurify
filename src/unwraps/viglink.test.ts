import { describe, expect, it } from 'bun:test'
import { unwrapViglink } from './viglink.js'

describe('unwrapViglink', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://redirect.viglink.com/?key=abc&u=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapViglink(url)).toBe('https://example.com/product')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://redirect.viglink.com/?key=abc')

    expect(unwrapViglink(url)).toBeUndefined()
  })

  it('should return undefined for non-VigLink hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapViglink(url)).toBeUndefined()
  })

  describe('redirect.viglink.com/?out=', () => {
    it('should extract target from out param', () => {
      const value = new URL(
        'https://redirect.viglink.com/?format=go&jsonp=vglnk_169232858866914&key=1f2e3d4c5b6a79881f2e3d4c5b6a7988&libId=llg0numf01002cim000ULb7jyhnc9&loc=https%3A%2F%2Fexample.org%2F2023%2F08%2F17%2Fpost%2F&v=1&out=https%3A%2F%2Fexample.com%2F2023%2F07%2F02%2Farticle%2F',
      )
      const expected = 'https://example.com/2023/07/02/article/'

      expect(unwrapViglink(value)).toBe(expected)
    })

    it('should return undefined when only loc param is present', () => {
      const value = new URL(
        'https://redirect.viglink.com/?format=go&key=1f2e3d4c5b6a79881f2e3d4c5b6a7988&loc=https%3A%2F%2Fexample.org%2F2023%2F08%2F17%2Fpost%2F&v=1',
      )

      expect(unwrapViglink(value)).toBeUndefined()
    })

    it('should prefer u over out when both are present', () => {
      const value = new URL(
        'https://redirect.viglink.com/?key=1f2e3d4c5b6a79881f2e3d4c5b6a7988&out=https%3A%2F%2Fexample.com%2Fb&u=https%3A%2F%2Fexample.com%2Fa',
      )
      const expected = 'https://example.com/a'

      expect(unwrapViglink(value)).toBe(expected)
    })
  })

  describe('api.viglink.com/api/click', () => {
    it('should extract target from out param', () => {
      const value = new URL(
        'http://api.viglink.com/api/click?format=go&key=0a1b2c3d4e5f60718293a4b5c6d7e8f9&loc=http%3A%2F%2Fexample.org%2Ft%2F570149%2Fthread&v=1&libid=1320420609691&out=http%3A%2F%2Fstore.example.com%2Fproduct_detail.php%3Fp%3D92&ref=http%3A%2F%2Fexample.org%2Ff%2F7197',
      )
      const expected = 'http://store.example.com/product_detail.php?p=92'

      expect(unwrapViglink(value)).toBe(expected)
    })

    it('should return undefined when only loc param is present', () => {
      const value = new URL(
        'http://api.viglink.com/api/click?format=go&key=0a1b2c3d4e5f60718293a4b5c6d7e8f9&loc=http%3A%2F%2Fexample.org%2Ft%2F570149%2Fthread&v=1',
      )

      expect(unwrapViglink(value)).toBeUndefined()
    })

    it('should return undefined for another path', () => {
      const value = new URL(
        'http://api.viglink.com/api/ping?key=0a1b2c3d4e5f60718293a4b5c6d7e8f9&out=http%3A%2F%2Fexample.com%2F',
      )

      expect(unwrapViglink(value)).toBeUndefined()
    })
  })

  describe('apicdn.viglink.com/api/click', () => {
    it('should extract target from out param', () => {
      const value = new URL(
        'http://apicdn.viglink.com/api/click?format=go&key=9f8e7d6c5b4a39281706f5e4d3c2b1a0&loc=https%3A%2F%2Fexample.org%2Ffeed%2F&out=https%3A%2F%2Fexample.com%2F3qb8s2R',
      )
      const expected = 'https://example.com/3qb8s2R'

      expect(unwrapViglink(value)).toBe(expected)
    })
  })

  describe('i.viglink.com impression beacon', () => {
    it('should return undefined', () => {
      const value = new URL(
        'http://i.viglink.com/?key=5a5b5c5d5e5f60616263646566676869&insertId=642c8c8665a86101&type=L&libId=jlhxc9do0102ar6c000DAgty440f5s89f&loc=https%3A%2F%2Fexample.org%2F%3Fp%3D8277&v=1&out=https%3A%2F%2Fexample.com',
      )

      expect(unwrapViglink(value)).toBeUndefined()
    })
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://eu.viglink.com/api/click?out=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapViglink(url)).toBeUndefined()
  })

  it('should return undefined for another path on the redirect host', () => {
    const url = new URL('https://redirect.viglink.com/other?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapViglink(url)).toBeUndefined()
  })

  it('should return undefined for the click api on a lookalike host', () => {
    const url = new URL('https://exampleviglink.com/api/click?out=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapViglink(url)).toBeUndefined()
  })
})
