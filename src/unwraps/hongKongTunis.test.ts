import { describe, expect, it } from 'bun:test'
import { unwrapHongKongTunis } from './hongKongTunis.js'

describe('unwrapHongKongTunis', () => {
  it('should extract the target from the converter path', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/www.info.gov.hk/gia/general/today.htm')
    const expected = 'https://www.info.gov.hk/gia/general/today.htm'

    expect(unwrapHongKongTunis(value)).toBe(expected)
  })

  it('should extract the target behind a doubled slash with its query', () => {
    const value = new URL(
      'https://sc.isd.gov.hk/TuniS//www.info.gov.hk/gia/general/202601/19/P2026011900589.htm?fontSize=1',
    )
    const expected = 'https://www.info.gov.hk/gia/general/202601/19/P2026011900589.htm?fontSize=1'

    expect(unwrapHongKongTunis(value)).toBe(expected)
  })

  it('should keep the scheme of a target that carries one', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/https://www.news.gov.hk/eng/index.html')
    const expected = 'https://www.news.gov.hk/eng/index.html'

    expect(unwrapHongKongTunis(value)).toBe(expected)
  })

  it('should return undefined for the converter root', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/')

    expect(unwrapHongKongTunis(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://sc.isd.gov.hk/eng/index.html')

    expect(unwrapHongKongTunis(value)).toBeUndefined()
  })

  it('should return undefined for the same path on another host', () => {
    const value = new URL('https://www.example.com/TuniS/www.info.gov.hk/gia/general/today.htm')

    expect(unwrapHongKongTunis(value)).toBeUndefined()
  })
})
