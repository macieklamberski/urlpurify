import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapYahooJapan } from './yahooJapan.js'

describe('unwrapYahooJapan', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://rdsig.yahoo.co.jp/a/RV=1/RU=d3d3LmV4YW1wbGUuY29tL3BhZ2U/RS=x'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapYahooJapan] })).toBe(expected)
  })

  it('should extract target from RU at the end of the path', () => {
    const value = new URL(
      'http://rdsig.yahoo.co.jp/rss/l/headlines/life/it_nlab/RV=1/RU=aHR0cDovL2hlYWRsaW5lcy5leGFtcGxlLmpwL2hsP2E9MjAxNjAzMTUtMDAwMDAxMTUtaXRfbmxhYi1saWZl',
    )
    const expected = 'http://headlines.example.jp/hl?a=20160315-00000115-it_nlab-life'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should extract a target padded with dashes', () => {
    const value = new URL(
      'http://rdsig.yahoo.co.jp/media/news/medianame/articles/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--',
    )
    const expected = 'http://www.example.jp/'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should extract a target with an underscore in its encoding', () => {
    const value = new URL(
      'https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvaGw_YT0x',
    )
    const expected = 'https://news.example.jp/hl?a=1'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should extract target from RU before RS', () => {
    const value = new URL(
      'https://rdsig.yahoo.co.jp/media/news/cobrand/gentosha/RV=1/RE=1519443377/RH=cmRzaWcueWFob28uY28uanA-/RB=/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RS=%5EADAuNHXqVhK9GzeGRWNnIzVmmCCrbI-',
    )
    const expected = 'http://www.example.jp/'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should extract target from RU before RK and RS', () => {
    const value = new URL(
      'http://rdsig.yahoo.co.jp/_ylt=A2RhPz5FnZJVVwEA1EWJBtF7/RV=1/RE=1435758277/RH=cmRzaWcueWFob28uY28uanA-/RB=/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RK=0/RS=TmWnL7B5QvGHDt1VuNnHsLfTjBQ-',
    )
    const expected = 'http://www.example.jp/'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should extract target from RU before a _ylt suffix', () => {
    const value = new URL(
      'https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvaGw_YT0x;_ylt=A2RhOZENAUdaYgcAl_Lylu',
    )
    const expected = 'https://news.example.jp/hl?a=1'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should drop the NUL byte that ends an RV=2 target', () => {
    const value = new URL(
      'https://rdsig.yahoo.co.jp/_ylt=A2RitNv7LKReEEQArzwxEv17/RV=2/RE=1587904123/RH=cmRzaWcueWFob28uY28uanA-/RB=0hhPzEMZe8pcrSwxTOAhs7SxldI-/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvYnlsaW5lL2tvbm5vaGFydWtpLwA-/RK=0/RS=Z_6bdIhHjo18f8Gld_xY6aMEdp8-',
    )
    const expected = 'https://news.example.jp/byline/konnoharuki/'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })

  it('should return undefined for a feed path without RU', () => {
    const value = new URL('https://rdsig.yahoo.co.jp/rss/l/headlines/')

    expect(unwrapYahooJapan(value)).toBeUndefined()
  })

  it('should return undefined when a segment other than R*= follows RU', () => {
    const value = new URL(
      'https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/extra',
    )

    expect(unwrapYahooJapan(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://rdsig.yahoo.co.jp/RV=1/RU=ZnRwOi8vZmlsZXMuZXhhbXBsZS5qcC9h'

    expect(purifyUrl(value, { unwrappers: [unwrapYahooJapan] })).toBe(value)
  })

  it('should return undefined for the RU path on Yahoo Search', () => {
    const value = new URL(
      'https://r.search.yahoo.com/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RK=0',
    )

    expect(unwrapYahooJapan(value)).toBeUndefined()
  })

  it('should return undefined for the RU path on another host', () => {
    const value = new URL('https://www.example.com/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--')

    expect(unwrapYahooJapan(value)).toBeUndefined()
  })

  it('should trim a long run of padding in linear time', () => {
    const value = new URL(`https://rdsig.yahoo.co.jp/RV=1/RU=${'-'.repeat(40000)}a`)
    const start = performance.now()

    unwrapYahooJapan(value)

    expect(performance.now() - start).toBeLessThan(50)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://rdsig.yahoo.co.jp/rss/l/headlines/life/it_nlab/RV=1/RU=aHR0cDovL2hlYWRsaW5lcy5leGFtcGxlLmpwL2hsP2E9MjAxNjAzMTUtMDAwMDAxMTUtaXRfbmxhYi1saWZlI3RvcA',
    )
    const expected = 'http://headlines.example.jp/hl?a=20160315-00000115-it_nlab-life#top'

    expect(unwrapYahooJapan(value)).toBe(expected)
  })
})
