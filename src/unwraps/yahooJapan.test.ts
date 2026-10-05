import { describe, expect, it } from 'bun:test'
import { unwrapYahooJapan } from './yahooJapan.js'

describe('unwrapYahooJapan', () => {
  it('should extract target from RU at the end of the path', () => {
    const url = new URL(
      'http://rdsig.yahoo.co.jp/rss/l/headlines/life/it_nlab/RV=1/RU=aHR0cDovL2hlYWRsaW5lcy5leGFtcGxlLmpwL2hsP2E9MjAxNjAzMTUtMDAwMDAxMTUtaXRfbmxhYi1saWZl',
    )

    expect(unwrapYahooJapan(url)).toBe(
      'http://headlines.example.jp/hl?a=20160315-00000115-it_nlab-life',
    )
  })

  it('should extract a target padded with dashes', () => {
    const url = new URL(
      'http://rdsig.yahoo.co.jp/media/news/medianame/articles/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--',
    )

    expect(unwrapYahooJapan(url)).toBe('http://www.example.jp/')
  })

  it('should extract a target with an underscore in its encoding', () => {
    const url = new URL(
      'https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvaGw_YT0x',
    )

    expect(unwrapYahooJapan(url)).toBe('https://news.example.jp/hl?a=1')
  })

  it('should extract target from RU before RS', () => {
    const url = new URL(
      'https://rdsig.yahoo.co.jp/media/news/cobrand/gentosha/RV=1/RE=1519443377/RH=cmRzaWcueWFob28uY28uanA-/RB=/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RS=%5EADAuNHXqVhK9GzeGRWNnIzVmmCCrbI-',
    )

    expect(unwrapYahooJapan(url)).toBe('http://www.example.jp/')
  })

  it('should extract target from RU before RK and RS', () => {
    const url = new URL(
      'http://rdsig.yahoo.co.jp/_ylt=A2RhPz5FnZJVVwEA1EWJBtF7/RV=1/RE=1435758277/RH=cmRzaWcueWFob28uY28uanA-/RB=/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RK=0/RS=TmWnL7B5QvGHDt1VuNnHsLfTjBQ-',
    )

    expect(unwrapYahooJapan(url)).toBe('http://www.example.jp/')
  })

  it('should extract target from RU before a _ylt suffix', () => {
    const url = new URL(
      'https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvaGw_YT0x;_ylt=A2RhOZENAUdaYgcAl_Lylu',
    )

    expect(unwrapYahooJapan(url)).toBe('https://news.example.jp/hl?a=1')
  })

  it('should drop the NUL byte that ends an RV=2 target', () => {
    const url = new URL(
      'https://rdsig.yahoo.co.jp/_ylt=A2RitNv7LKReEEQArzwxEv17/RV=2/RE=1587904123/RH=cmRzaWcueWFob28uY28uanA-/RB=0hhPzEMZe8pcrSwxTOAhs7SxldI-/RU=aHR0cHM6Ly9uZXdzLmV4YW1wbGUuanAvYnlsaW5lL2tvbm5vaGFydWtpLwA-/RK=0/RS=Z_6bdIhHjo18f8Gld_xY6aMEdp8-',
    )

    expect(unwrapYahooJapan(url)).toBe('https://news.example.jp/byline/konnoharuki/')
  })

  it('should return undefined for a feed path without RU', () => {
    const url = new URL('https://rdsig.yahoo.co.jp/rss/l/headlines/')

    expect(unwrapYahooJapan(url)).toBeUndefined()
  })

  it('should return undefined when a segment other than R*= follows RU', () => {
    const url = new URL('https://rdsig.yahoo.co.jp/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/extra')

    expect(unwrapYahooJapan(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://rdsig.yahoo.co.jp/RV=1/RU=ZnRwOi8vZmlsZXMuZXhhbXBsZS5qcC9h')

    expect(unwrapYahooJapan(url)).toBeUndefined()
  })

  it('should return undefined for the RU path on Yahoo Search', () => {
    const url = new URL('https://r.search.yahoo.com/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--/RK=0')

    expect(unwrapYahooJapan(url)).toBeUndefined()
  })

  it('should return undefined for the RU path on another host', () => {
    const url = new URL('https://www.example.com/RV=1/RU=aHR0cDovL3d3dy5leGFtcGxlLmpwLw--')

    expect(unwrapYahooJapan(url)).toBeUndefined()
  })
})
