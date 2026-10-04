import { describe, expect, it } from 'bun:test'
import { unwrapValuecommerce } from './valuecommerce.js'

describe('unwrapValuecommerce', () => {
  it('should extract target from vc_url param', () => {
    const url = new URL(
      'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890&vc_url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapValuecommerce(url)).toBe('https://example.com/product')
  })

  it('should return undefined when vc_url param is missing', () => {
    const url = new URL('https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890')

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for non-referral paths', () => {
    const url = new URL('https://ck.jp.ap.valuecommerce.com/click?vc_url=https%3A%2F%2Fexample.com')

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for non-ValueCommerce hosts', () => {
    const url = new URL('https://example.com/servlet/referral?vc_url=https%3A%2F%2Fother.com')

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined when only the _su source page is present', () => {
    const url = new URL(
      'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=12345&pid=67890&_su=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should extract target from vc_url param on the atq referral path', () => {
    const url = new URL(
      'http://atq.ck.valuecommerce.com/servlet/atq/referral?sid=2219441&pid=877935733&vcptn=2219441%2Fn1ebXmw&vc_url=http%3A%2F%2Fexample.com%2Fitem.html',
    )

    expect(unwrapValuecommerce(url)).toBe('http://example.com/item.html')
  })

  it('should extract target from vcurl param on the dck path', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a?pid=887709230&sid=3641646&aid=2797472&mid=3366797&isec=664ecf1b&vcurl=https%3A%2F%2Fexample.com%2Fshop%2F&ckref=https%3A%2F%2Fexample.org%2Fpost.html',
    )

    expect(unwrapValuecommerce(url)).toBe('https://example.com/shop/')
  })

  it('should return undefined when only the ckref source page is present on the dck path', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a?pid=887709230&sid=3641646&ckref=https%3A%2F%2Fexample.org%2Fpost.html',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for non-dck paths on the dalr host', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/click?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for the dck path on non-ValueCommerce hosts', () => {
    const url = new URL(
      'https://example.com/dck/f46a15718a?vcurl=https%3A%2F%2Fexample.org%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for the dck path below another segment', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/x/dck/f46a15718a?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for a segment after the dck id', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/dck/f46a15718a/extra?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for a dck id that is not hex', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/dck/xyz?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for the dck path without an id', () => {
    const url = new URL(
      'https://dalr.valuecommerce.com/dck/?vcurl=https%3A%2F%2Fexample.com%2Fshop%2F',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted referral subdomain', () => {
    const url = new URL(
      'https://ck.us.ap.valuecommerce.com/servlet/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplevaluecommerce.com/servlet/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted atq subdomain', () => {
    const url = new URL(
      'https://atq.ck.us.valuecommerce.com/servlet/atq/referral?vc_url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted dck subdomain', () => {
    const url = new URL(
      'https://dalr2.valuecommerce.com/dck/ab12?vcurl=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapValuecommerce(url)).toBeUndefined()
  })
})
