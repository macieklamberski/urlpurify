import { describe, expect, it } from 'bun:test'
import { unwrapValuecommerce } from './valuecommerce.js'

describe('unwrapValuecommerce', () => {
  it('should extract target from vc_url param', () => {
    const value = new URL(
      'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890&vc_url=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapValuecommerce(value)).toBe(expected)
  })

  it('should return undefined when vc_url param is missing', () => {
    const value = new URL('https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890')

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for non-referral paths', () => {
    const value = new URL(
      'https://ck.jp.ap.valuecommerce.com/click?vc_url=https%3A%2F%2Fexample.com',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for non-ValueCommerce hosts', () => {
    const value = new URL('https://example.com/servlet/referral?vc_url=https%3A%2F%2Fother.com')

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined when only the _su source page is present', () => {
    const value = new URL(
      'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890&_su=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should extract target from vc_url param on the atq referral path', () => {
    const value = new URL(
      'http://atq.ck.valuecommerce.com/servlet/atq/referral?sid=2219441&pid=877935733&vcptn=2219441%2Fn1ebXmw&vc_url=http%3A%2F%2Fexample.com%2Fitem.html',
    )
    const expected = 'http://example.com/item.html'

    expect(unwrapValuecommerce(value)).toBe(expected)
  })

  it('should extract target from vcurl param on the dck path', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a?pid=887709230&sid=3641646&aid=2797472&mid=3366797&isec=664ecf1b&vcurl=https%3A%2F%2Fexample.com%2Fshop%2F&ckref=https%3A%2F%2Fexample.org%2Fpost.html',
    )
    const expected = 'https://example.com/shop/'

    expect(unwrapValuecommerce(value)).toBe(expected)
  })

  it('should return undefined when only the ckref source page is present on the dck path', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a?pid=887709230&sid=3641646&ckref=https%3A%2F%2Fexample.org%2Fpost.html',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for non-dck paths on the dalr host', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/click?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for the dck path on non-ValueCommerce hosts', () => {
    const value = new URL(
      'https://example.com/dck/f46a15718a?vcurl=https%3A%2F%2Fexample.org%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for the dck path below another segment', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/x/dck/f46a15718a?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for a segment after the dck id', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a/extra?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for a dck id that is not hex', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/dck/xyz?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for the dck path without an id', () => {
    const value = new URL(
      'https://dalr.valuecommerce.com/dck/?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted referral subdomain', () => {
    const value = new URL(
      'https://ck.us.ap.valuecommerce.com/servlet/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplevaluecommerce.com/servlet/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted atq subdomain', () => {
    const value = new URL(
      'https://atq.ck.us.valuecommerce.com/servlet/atq/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted dck subdomain', () => {
    const value = new URL(
      'https://dalr2.valuecommerce.com/dck/ab12?vcurl=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(value)).toBeUndefined()
  })
})
