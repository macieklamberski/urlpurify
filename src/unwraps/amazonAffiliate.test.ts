import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapperHosts } from '../utils.js'
import { unwrapAmazonAffiliate } from './amazonAffiliate.js'

describe('unwrapAmazonAffiliate', () => {
  it('should repair a store redirect target the CMS spaced after its scheme', () => {
    const value =
      'https://www.amazon.com/gp/redirect.html?location=http%3A%2F%2F+https%3A%2F%2Fwww.example.com%2Fzh-TW%2Factivity%2F20707'
    const expected = 'https://www.example.com/zh-TW/activity/20707'

    expect(purifyUrl(value, { unwrappers: [unwrapAmazonAffiliate] })).toBe(expected)
  })

  it('should extract target URL appended after the click id', () => {
    const value = new URL(
      'https://aax-us-east.amazon-adsystem.com/x/c/abc123/https://www.amazon.com/dp/B0EXAMPLE',
    )
    const expected = 'https://www.amazon.com/dp/B0EXAMPLE'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL(
      'https://aax-us-east.amazon-adsystem.com/x/c/abc123/https://www.amazon.com/dp/B0EXAMPLE?th=1',
    )
    const expected = 'https://www.amazon.com/dp/B0EXAMPLE?th=1'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should accept http:// targets', () => {
    const value = new URL('https://aax-eu.amazon-adsystem.com/x/c/xyz789/http://example.com/page')
    const expected = 'http://example.com/page'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should return undefined when the path lacks an embedded URL', () => {
    const value = new URL('https://aax-us-east.amazon-adsystem.com/x/c/abc123/')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for non-tracker paths', () => {
    const value = new URL(
      'https://aax-us-east.amazon-adsystem.com/aap/?id=abc&dest=https%3A%2F%2Fexample.com',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for non-Amazon hosts', () => {
    const value = new URL('https://example.com/x/c/abc/https://other.com/dp/X')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should extract the location param of a store redirect', () => {
    const value = new URL(
      'http://www.amazon.com/gp/redirect.html?ie=UTF8&location=http%3A%2F%2Fexample.com%2Fproduct%2F1891375237%2F&tag=example-20&linkCode=ur2&camp=1789&creative=9325',
    )
    const expected = 'http://example.com/product/1891375237/'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.amazon.com/gp/redirect.html?ie=UTF8&location=https://example.org/search/a+b&tag=example-20&linkCode=ur2&camp=1789&creative=9325',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the location param of a store redirect with a ref segment', () => {
    const value = new URL(
      'http://www.amazon.com/gp/redirect.html/ref=cm_plog_item_link/002-7179141-9422448?ie=UTF8&location=http%3A%2F%2Fexample.com%2Fabout&token=D2A005D07C0036D7D727F5D866D947AA9EFF3466',
    )
    const expected = 'http://example.com/about'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the location param of a store redirect on another tld', () => {
    const value = new URL(
      'https://www.amazon.co.jp/gp/redirect.html?ie=UTF8&location=https%3A%2F%2Fexample.com%2Fdp%2F4774123706&tag=example-22&linkCode=ur2&camp=247&creative=1211',
    )
    const expected = 'https://example.com/dp/4774123706'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the location param of a store redirect on a store of any ending', () => {
    const value = new URL(
      'https://www.amazon.nl/gp/redirect.html?location=https%3A%2F%2Fexample.com%2Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the path param of a legacy store redirect', () => {
    const value = new URL(
      'http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=example-20&camp=1789&creative=9325&path=http%3A%2F%2Fexample.com%2Fproduct%2F0142000280%3Fn%3D507846%26s%3Dbooks',
    )
    const expected = 'http://example.com/product/0142000280?n=507846&s=books'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the U param of a store email redirect', () => {
    const value = new URL(
      'https://www.amazon.fr/gp/r.html?C=1YTHHJY0YJ0D0&R=27QWTB4ZZ2K2P&T=C&U=https%3A%2F%2Fexample.com%2Fmc%3Fref_%3Dpe_58291691&H=1446WTOTM7PEXTI13CO3TRKOB78A',
    )
    const expected = 'https://example.com/mc?ref_=pe_58291691'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the U param of a store email redirect on the smile host', () => {
    const value = new URL(
      'https://smile.amazon.com/gp/r.html?C=3JTDOSORXPWJG&R=3ABDUXNKBHD5S&T=C&U=https%3A%2F%2Fexample.com%2Forders&H=HQIZHNZXCCZCPQQXVCW5T4QGJQSA',
    )
    const expected = 'https://example.com/orders'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the U param of a store email redirect on the f.html path', () => {
    const value = new URL(
      'https://www.amazon.ca/gp/f.html?C=1JDTYWBDK5ZYA&M=urn:rtn:msg:20190106004449f59482f188a348aab016089016e0p0na&R=3WYOPBPLHUVC&T=C&U=https%3A%2F%2Fexample.com%2Fwishlist%2F1P4Z6P897JRCU&H=OOM6BJIBISAR4JASTLTAQTXNVEWA',
    )
    const expected = 'https://example.com/wishlist/1P4Z6P897JRCU'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the U param of a store email redirect on the com.au tld', () => {
    const value = new URL(
      'https://www.amazon.com.au/gp/f.html?C=3PA7Q5PDNDL9K&R=3MI5VW5WPB4EJ&T=C&U=https%3A%2F%2Fexample.com%2Fdp%2FB00ICS8MEI',
    )
    const expected = 'https://example.com/dp/B00ICS8MEI'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract the url param of a sponsored product redirect', () => {
    const value = new URL(
      'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A04820722IPKTVSMTMVM9&url=https%3A%2F%2Fexample.com%2Fdp%2FB00O4L3F9E%3Fpsc%3D1&qualifier=1495471480',
    )
    const expected = 'https://example.com/dp/B00O4L3F9E?psc=1'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should extract a twice-encoded store redirect target', () => {
    const value = new URL(
      'http://www.amazon.com/gp/redirect.html?ie=UTF8&location=http%253A%252F%252Fexample.com%252Fs%253Fk%253Dbooks&tag=example-20',
    )
    const expected = 'http://example.com/s?k=books'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should return undefined for a store redirect without a target', () => {
    const value = new URL('https://www.amazon.com/gp/redirect.html?ie=UTF8&tag=example-20')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should keep the wrapper for a store redirect with a non-http target', () => {
    const value = 'https://www.amazon.com/gp/redirect.html?location=javascript%3Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapAmazonAffiliate] })).toBe(value)
  })

  it('should return undefined for other store paths', () => {
    const value = new URL(
      'https://www.amazon.com/dp/B0EXAMPLE?location=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a store redirect shape on a non-Amazon host', () => {
    const value = new URL(
      'https://example.com/gp/redirect.html?location=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a store redirect on a lookalike host', () => {
    const value = new URL(
      'https://www.amazon.example.com/gp/redirect.html?location=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the path param on another obidos path', () => {
    const value = new URL(
      'https://www.amazon.com/exec/obidos/ASIN/0142000280?path=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the url param on a store path that is not a redirect', () => {
    const value = new URL(
      'https://www.amazon.com/gp/bit/apps/web/SIA/scraper?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://exampleamazon.com/gp/redirect.html?location=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should extract the target of the click tracker on aax-us-iad.amazon.com', () => {
    const value = new URL('https://aax-us-iad.amazon.com/x/c/abc123/https://example.com/page')
    const expected = 'https://example.com/page'

    expect(unwrapAmazonAffiliate(value)).toBe(expected)
  })

  it('should return undefined for a store redirect on a bare Amazon domain', () => {
    const value = new URL(
      'https://amazon.co.uk/gp/redirect.html?location=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a store redirect on another Amazon subdomain', () => {
    const value = new URL(
      'https://sellercentral.amazon.com/gp/redirect.html?location=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker on the bare adsystem domain', () => {
    const value = new URL('https://amazon-adsystem.com/x/c/abc123/https://example.com/page')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker on an adsystem host that is not aax', () => {
    const value = new URL('https://ads.amazon-adsystem.com/x/c/abc123/https://example.com/page')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker on a subdomain of an aax host', () => {
    const value = new URL(
      'https://sub.aax-us-east.amazon-adsystem.com/x/c/abc123/https://example.com/page',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker on a host that only ends in aax', () => {
    const value = new URL('https://xaax-eu.amazon-adsystem.com/x/c/abc123/https://example.com/page')

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for the click tracker on a host that only starts with aax', () => {
    const value = new URL(
      'https://aax-eu.amazon-adsystem.com.example.net/x/c/abc123/https://example.com/page',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a store redirect on a host that nests www', () => {
    const value = new URL(
      'https://evil.www.amazon.com/gp/redirect.html?location=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should return undefined for a store redirect on a host that only ends in www', () => {
    const value = new URL(
      'https://xwww.amazon.com/gp/redirect.html?location=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAmazonAffiliate(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapAmazonAffiliate)).toBe(true)
  })
})
