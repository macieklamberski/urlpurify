import { describe, expect, it } from 'bun:test'
import { unwrapAccesstrade } from './accesstrade.js'

describe('unwrapAccesstrade', () => {
  it('should extract target from h.accesstrade.net', () => {
    const value = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fwww.example.co.jp%2Fproducts%2Fdetail%2Fitem%2F227203%2F',
    )
    const expected = 'https://www.example.co.jp/products/detail/item/227203/'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract target from www.accesstrade.net', () => {
    const value = new URL(
      'http://www.accesstrade.net/at/c.html?rk=01001xof000r53&url=http%3A%2F%2Fwww.example.com%2Ftimesale.htm',
    )
    const expected = 'http://www.example.com/timesale.htm'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract target when the url param follows the wrapper own params', () => {
    const value = new URL(
      'http://h.accesstrade.net/sp/cc?rk=010024ha006cfg&ws_p_type=1&url=http%3A%2F%2Fexample.com%2Fredirects%2F%3Fpid%3D2200%26sid%3D0000&add=821504',
    )
    const expected = 'http://example.com/redirects/?pid=2200&sid=0000'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract target from the Vietnamese adv.php', () => {
    const value = new URL(
      'http://click.accesstrade.vn/adv.php?rk=00006800050z&url=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract an unencoded target from the Vietnamese deep_link', () => {
    const value = new URL(
      'https://fast.accesstrade.com.vn/deep_link/4498810930962836187?url=https://www.example.com/',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract target from a deep_link with two ids', () => {
    const value = new URL(
      'https://fast.accesstrade.com.vn/deep_link/4496640465605415172/5325601808419035241?url=https%3A%2F%2Fexample.com%2Fapp',
    )
    const expected = 'https://example.com/app'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should extract target from the Thai adv.php', () => {
    const value = new URL(
      'https://click.accesstrade.in.th/adv.php?rk=001bcv0001m3&YLblog=01&url=https%3A%2F%2Fexample.com%2F%25E0%25B8%258A',
    )
    const expected = 'https://example.com/%E0%B8%8A'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01003xwv001i5o&url=http%3A%2F%2Fexample.com%2Fitem%3Futm_source%3Daccesstrade%26utm_medium%3Dreferral%23top',
    )
    const expected = 'http://example.com/item?utm_source=accesstrade&utm_medium=referral#top'

    expect(unwrapAccesstrade(value)).toBe(expected)
  })

  it('should return undefined for another path on the domain', () => {
    const value = new URL(
      'https://h.accesstrade.net/sp/other?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const value = new URL('https://www.accesstrade.net/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the tracking path', () => {
    const value = new URL('https://h.accesstrade.net/sp/cc/extra?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a path that only ends with the tracking path', () => {
    const value = new URL('https://h.accesstrade.net/x/sp/cc?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a deep_link without an id', () => {
    const value = new URL(
      'https://fast.accesstrade.com.vn/deep_link/?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a deep_link with three ids', () => {
    const value = new URL(
      'https://fast.accesstrade.com.vn/deep_link/1/2/3?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a look-alike of the at path', () => {
    const value = new URL('https://www.accesstrade.net/at/cxhtml?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://h.accesstrade.net/sp/cc?rk=01001xqc00op53')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://tracking.example.com/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })

  it('should return undefined for a look-alike of the adv path', () => {
    const value = new URL('https://click.accesstrade.vn/advxphp?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(value)).toBeUndefined()
  })
})
