import { describe, expect, it } from 'bun:test'
import { unwrapReviveAdserver } from './reviveAdserver.js'

describe('unwrapReviveAdserver', () => {
  it('should extract target from oaparams', () => {
    const value = new URL(
      'http://underconsideration.com/oa_x/www/delivery/ck.php?oaparams=2__bannerid=19__zoneid=0__cb=6fb431d12d__oadest=http%3A%2F%2Fbranding.example.com%2F',
    )
    const expected = 'http://branding.example.com/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target after the ct param', () => {
    const value = new URL(
      'https://adms.hket.com/openxprod2/www/delivery/ck.php?ct=1&oaparams=2__bannerid=6685__zoneid=2040__cb=dfaf38fc52__oadest=https://www.example.com/boards/378006',
    )
    const expected = 'https://www.example.com/boards/378006'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should keep the unencoded query of the target', () => {
    const value = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__zoneid=19__cb=21b5731890__oadest=https://www.example.com/page?a=1&b=2',
    )
    const expected = 'https://www.example.com/page?a=1&b=2'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'http://underconsideration.com/oa_x/www/delivery/ck.php?oaparams=2__bannerid=610__zoneid=0__cb=f5f76b3abf__oadest=http%3A%2F%2Fwww.example.com%2F%3Futm_source%3DJuly2016%26utm_medium%3D%2520July2016',
    )
    const expected = 'http://www.example.com/?utm_source=July2016&utm_medium=%20July2016'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target from a signed click', () => {
    const value = new URL(
      'https://adserver.arbtalk.co.uk/www/delivery/ck.php?bannerid=196&zoneid=0&sig=3f6ac4244e2dc3d6243daeb40a5365d96ac5dfb7f72dd6d27fc62a26d5cd4135&oadest=https://www.example.com/stockists/',
    )
    const expected = 'https://www.example.com/stockists/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target from a signed click on cl.php', () => {
    const value = new URL(
      'https://servedby.pinktriangle.ca/cl.php?bannerid=30237&zoneid=348&sig=3a2a6fdc3ded9af5da1c7f73ee804c3baf84b15477b4c873cffd158b1bed365c&oadest=https%3A%2F%2Fwww.example.com%2Fabout%2F',
    )
    const expected = 'https://www.example.com/about/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target when the query separator is percent-encoded', () => {
    const value = new URL(
      'http://ads.example.net/baner/www/delivery/ck.php?ct=1%26oaparams=2__bannerid=7__zoneid=5__cb=4adf6a6bd2__oadest=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target from a phpAdsNew click', () => {
    const value = new URL(
      'http://dsiworld.net/ads/adclick.php?bannerid=41&zoneid=6&source=&dest=http%3A%2F%2Fwww.example.com%2Fshop%2Findex.jsp%3FcategoryId%3D2039765',
    )
    const expected = 'http://www.example.com/shop/index.jsp?categoryId=2039765'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'http://www.example.com/ads/adclick.php?bannerid=41&zoneid=6&source=&dest=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.example.com/ads/adclick.php?bannerid=41&zoneid=6&source=&dest=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target from a phpAdsNew click on the root', () => {
    const value = new URL(
      'https://ads.example.net/adclick.php?bannerid=209&zoneid=0&dest=https://www.example.com/',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should return undefined for another delivery script', () => {
    const value = new URL(
      'http://ads.example.net/www/delivery/ak.php?oaparams=2__bannerid=40__oadest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should extract target from dest when oadest is missing', () => {
    const value = new URL(
      'http://ads.example.net/www/delivery/ck.php?n=a1b2c3&cb=123&dest=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should extract target from the OpenX 2 maxdest', () => {
    const value = new URL(
      'http://us.openx.detik.com/delivery/ck.php?oaparams=2__bannerid=22117__zoneid=348__cb=0582b2efbd__maxdest=http%3A%2F%2Fwww.example.com%2Fpromo',
    )
    const expected = 'http://www.example.com/promo'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should return undefined for a click without a destination', () => {
    const value = new URL('http://ads.example.net/www/delivery/ck.php?n=a1b2c3&cb=123')

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__oadest=javascript%3Aalert(1)',
    )

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'http://ads.example.net/www/delivery/ck.php?oaparams=2__bannerid=40__oadest=https://www.example.com/%E0%A4%A',
    )
    const expected = 'https://www.example.com/%E0%A4%A'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })

  it('should return undefined for a script that only ends in adclick.php', () => {
    const value = new URL(
      'http://ads.example.net/myadclick.php?bannerid=41&zoneid=6&dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew path without bannerid', () => {
    const value = new URL(
      'http://ads.example.net/adclick.php?id=12&dest=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew non-http target', () => {
    const value = new URL(
      'http://ads.example.net/adclick.php?bannerid=41&zoneid=6&dest=javascript%3Aalert(1)',
    )

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a phpAdsNew click without dest', () => {
    const value = new URL('http://ads.example.net/adclick.php?bannerid=41&zoneid=6&source=')

    expect(unwrapReviveAdserver(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://underconsideration.com/oa_x/www/delivery/ck.php?oaparams=2__bannerid=19__zoneid=0__cb=6fb431d12d__oadest=http%3A%2F%2Fbranding.example.com%2F%23top',
    )
    const expected = 'http://branding.example.com/#top'

    expect(unwrapReviveAdserver(value)).toBe(expected)
  })
})
