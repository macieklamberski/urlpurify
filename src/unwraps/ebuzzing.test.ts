import { describe, expect, it } from 'bun:test'
import { unwrapEbuzzing } from './ebuzzing.js'

describe('unwrapEbuzzing', () => {
  it('should extract the target after the ids', () => {
    const value = new URL(
      'http://www.ebuzzing.com/rd/23688_2506_388807_12219_9759_3597/www.example.com/fr/app/renault-espace-for-iphone/id432396057?mt=8',
    )
    const expected = 'http://www.example.com/fr/app/renault-espace-for-iphone/id432396057?mt=8'

    expect(unwrapEbuzzing(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(
      'http://www.ebuzzing.it/rd/20910_3092_472018_21592_16528_8308/www.example.it/offerta/miracoli.html#top',
    )
    const expected = 'http://www.example.it/offerta/miracoli.html#top'

    expect(unwrapEbuzzing(value)).toBe(expected)
  })

  it('should return undefined for a target that keeps its scheme', () => {
    const value = new URL(
      'http://www.ebuzzing.com/rd/22239_2260_355443_23029_17310_3287/https://www.example.com/partner',
    )

    expect(unwrapEbuzzing(value)).toBeUndefined()
  })

  it('should return undefined for ids holding a letter', () => {
    const value = new URL('http://www.ebuzzing.com/rd/23688_2506_abc/www.example.com/page.html')

    expect(unwrapEbuzzing(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://www.ebuzzing.com/rdro/23688_2506_388807/www.example.com/page.html',
    )

    expect(unwrapEbuzzing(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('http://example.com/rd/23688_2506_388807_12219/www.example.org/page.html')

    expect(unwrapEbuzzing(value)).toBeUndefined()
  })

  it('should return undefined for a target with no dot in its first segment', () => {
    const value = new URL('http://www.ebuzzing.com/rd/23688_2506_388807/archive/page.html')

    expect(unwrapEbuzzing(value)).toBeUndefined()
  })
})
