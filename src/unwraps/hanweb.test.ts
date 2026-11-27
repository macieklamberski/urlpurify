import { describe, expect, it } from 'bun:test'
import { unwrapHanweb } from './hanweb.js'

describe('unwrapHanweb', () => {
  it('should extract the target from the converter path', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/www.info.gov.hk/gia/general/today.htm')
    const expected = 'https://www.info.gov.hk/gia/general/today.htm'

    expect(unwrapHanweb(value)).toBe(expected)
  })

  it('should extract the target behind a doubled slash with its query', () => {
    const value = new URL(
      'https://sc.isd.gov.hk/TuniS//www.info.gov.hk/gia/general/202601/19/P2026011900589.htm?fontSize=1',
    )
    const expected = 'https://www.info.gov.hk/gia/general/202601/19/P2026011900589.htm?fontSize=1'

    expect(unwrapHanweb(value)).toBe(expected)
  })

  it('should keep the scheme of a target that carries one', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/https://www.news.gov.hk/eng/index.html')
    const expected = 'https://www.news.gov.hk/eng/index.html'

    expect(unwrapHanweb(value)).toBe(expected)
  })

  it('should return undefined for the converter root', () => {
    const value = new URL('https://sc.isd.gov.hk/TuniS/')

    expect(unwrapHanweb(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://sc.isd.gov.hk/eng/index.html')

    expect(unwrapHanweb(value)).toBeUndefined()
  })

  it('should extract the target from the converter on another site', () => {
    const value = new URL('https://gbcode.rthk.hk/TuniS/news.rthk.hk/rthk/ch/latest-news.htm')
    const expected = 'https://news.rthk.hk/rthk/ch/latest-news.htm'

    expect(unwrapHanweb(value)).toBe(expected)
  })

  it('should extract the target from the converter on its own port', () => {
    const value = new URL('http://www.mjc.mo:8080/TuniS/www.mjc.mo/race/info/index.php')
    const expected = 'https://www.mjc.mo/race/info/index.php'

    expect(unwrapHanweb(value)).toBe(expected)
  })

  it('should return undefined for a path segment that is not a host', () => {
    const value = new URL('https://travel.example.com/tunis/medina/hotels/')

    expect(unwrapHanweb(value)).toBeUndefined()
  })
})
