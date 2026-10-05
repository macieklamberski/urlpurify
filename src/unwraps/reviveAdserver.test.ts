import { describe, expect, it } from 'bun:test'
import { unwrapReviveAdserver } from './reviveAdserver.js'

describe('unwrapReviveAdserver', () => {
  it('should extract target from oaparams', () => {
    const url = new URL(
      'http://underconsideration.com/oa_x/www/delivery/ck.php?oaparams=2__bannerid=19__zoneid=0__cb=6fb431d12d__oadest=http%3A%2F%2Fbranding.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBe('http://branding.example.com/')
  })

  it('should extract target after the ct param', () => {
    const url = new URL(
      'https://adms.hket.com/openxprod2/www/delivery/ck.php?ct=1&oaparams=2__bannerid=6685__zoneid=2040__cb=dfaf38fc52__oadest=https://www.example.com/boards/378006',
    )

    expect(unwrapReviveAdserver(url)).toBe('https://www.example.com/boards/378006')
  })

  it('should keep the unencoded query of the target', () => {
    const url = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__zoneid=19__cb=21b5731890__oadest=https://www.example.com/page?a=1&b=2',
    )

    expect(unwrapReviveAdserver(url)).toBe('https://www.example.com/page?a=1&b=2')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'http://underconsideration.com/oa_x/www/delivery/ck.php?oaparams=2__bannerid=610__zoneid=0__cb=f5f76b3abf__oadest=http%3A%2F%2Fwww.example.com%2F%3Futm_source%3DJuly2016%26utm_medium%3D%2520July2016',
    )

    expect(unwrapReviveAdserver(url)).toBe(
      'http://www.example.com/?utm_source=July2016&utm_medium=%20July2016',
    )
  })

  it('should extract target from a signed click', () => {
    const url = new URL(
      'https://adserver.arbtalk.co.uk/www/delivery/ck.php?bannerid=196&zoneid=0&sig=3f6ac4244e2dc3d6243daeb40a5365d96ac5dfb7f72dd6d27fc62a26d5cd4135&oadest=https://www.example.com/stockists/',
    )

    expect(unwrapReviveAdserver(url)).toBe('https://www.example.com/stockists/')
  })

  it('should extract target when the query separator is percent-encoded', () => {
    const url = new URL(
      'http://ads.example.net/baner/www/delivery/ck.php?ct=1%26oaparams=2__bannerid=7__zoneid=5__cb=4adf6a6bd2__oadest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBe('https://www.example.com/')
  })

  it('should extract target from a phpAdsNew click', () => {
    const url = new URL(
      'http://dsiworld.net/ads/adclick.php?bannerid=41&zoneid=6&source=&dest=http%3A%2F%2Fwww.example.com%2Fshop%2Findex.jsp%3FcategoryId%3D2039765',
    )

    expect(unwrapReviveAdserver(url)).toBe(
      'http://www.example.com/shop/index.jsp?categoryId=2039765',
    )
  })

  it('should extract target from a phpAdsNew click on the root', () => {
    const url = new URL(
      'https://ads.example.net/adclick.php?bannerid=209&zoneid=0&dest=https://www.example.com/',
    )

    expect(unwrapReviveAdserver(url)).toBe('https://www.example.com/')
  })

  it('should return undefined for another delivery script', () => {
    const url = new URL(
      'http://ads.example.net/www/delivery/ak.php?oaparams=2__bannerid=40__oadest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a click without oadest', () => {
    const url = new URL(
      'http://ads.example.net/www/delivery/ck.php?n=a1b2c3&cb=123&dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__oadest=javascript%3Aalert(1)',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a malformed percent-encoding', () => {
    const url = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__oadest=https://www.example.com/%E0%A4%A',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a script that only ends in adclick.php', () => {
    const url = new URL(
      'http://ads.example.net/myadclick.php?bannerid=41&zoneid=6&dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew path without bannerid', () => {
    const url = new URL(
      'http://ads.example.net/adclick.php?id=12&dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew non-http target', () => {
    const url = new URL(
      'http://ads.example.net/adclick.php?bannerid=41&zoneid=6&dest=javascript%3Aalert(1)',
    )

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew click without dest', () => {
    const url = new URL('http://ads.example.net/adclick.php?bannerid=41&zoneid=6&source=')

    expect(unwrapReviveAdserver(url)).toBeUndefined()
  })
})
