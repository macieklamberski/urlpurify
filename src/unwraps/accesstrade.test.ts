import { describe, expect, it } from 'bun:test'
import { unwrapAccesstrade } from './accesstrade.js'

describe('unwrapAccesstrade', () => {
  it('should extract target from h.accesstrade.net', () => {
    const url = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fwww.example.co.jp%2Fproducts%2Fdetail%2Fitem%2F227203%2F',
    )

    expect(unwrapAccesstrade(url)).toBe('https://www.example.co.jp/products/detail/item/227203/')
  })

  it('should extract target from www.accesstrade.net', () => {
    const url = new URL(
      'http://www.accesstrade.net/at/c.html?rk=01001xof000r53&url=http%3A%2F%2Fwww.example.com%2Ftimesale.htm',
    )

    expect(unwrapAccesstrade(url)).toBe('http://www.example.com/timesale.htm')
  })

  it('should extract target when the url param follows the wrapper own params', () => {
    const url = new URL(
      'http://h.accesstrade.net/sp/cc?rk=010024ha006cfg&ws_p_type=1&url=http%3A%2F%2Fexample.com%2Fredirects%2F%3Fpid%3D2200%26sid%3D0000&add=821504',
    )

    expect(unwrapAccesstrade(url)).toBe('http://example.com/redirects/?pid=2200&sid=0000')
  })

  it('should extract target from the Vietnamese adv.php', () => {
    const url = new URL(
      'http://click.accesstrade.vn/adv.php?rk=00006800050z&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBe('https://example.com/')
  })

  it('should extract an unencoded target from the Vietnamese deep_link', () => {
    const url = new URL(
      'https://fast.accesstrade.com.vn/deep_link/4498810930962836187?url=https://www.example.com/',
    )

    expect(unwrapAccesstrade(url)).toBe('https://www.example.com/')
  })

  it('should extract target from a deep_link with two ids', () => {
    const url = new URL(
      'https://fast.accesstrade.com.vn/deep_link/4496640465605415172/5325601808419035241?url=https%3A%2F%2Fexample.com%2Fapp',
    )

    expect(unwrapAccesstrade(url)).toBe('https://example.com/app')
  })

  it('should extract target from the Thai adv.php', () => {
    const url = new URL(
      'https://click.accesstrade.in.th/adv.php?rk=001bcv0001m3&YLblog=01&url=https%3A%2F%2Fexample.com%2F%25E0%25B8%258A',
    )

    expect(unwrapAccesstrade(url)).toBe('https://example.com/%E0%B8%8A')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://h.accesstrade.net/sp/cc?rk=01003xwv001i5o&url=http%3A%2F%2Fexample.com%2Fitem%3Futm_source%3Daccesstrade%26utm_medium%3Dreferral%23top',
    )

    expect(unwrapAccesstrade(url)).toBe(
      'http://example.com/item?utm_source=accesstrade&utm_medium=referral#top',
    )
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL(
      'https://s.accesstrade.net/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBe('https://example.com/')
  })

  it('should return undefined for another path on the domain', () => {
    const url = new URL(
      'https://h.accesstrade.net/sp/other?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const url = new URL('https://www.accesstrade.net/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the tracking path', () => {
    const url = new URL('https://h.accesstrade.net/sp/cc/extra?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a path that only ends with the tracking path', () => {
    const url = new URL('https://h.accesstrade.net/x/sp/cc?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a deep_link without an id', () => {
    const url = new URL(
      'https://fast.accesstrade.com.vn/deep_link/?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a deep_link with three ids', () => {
    const url = new URL(
      'https://fast.accesstrade.com.vn/deep_link/1/2/3?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a look-alike of the at path', () => {
    const url = new URL('https://www.accesstrade.net/at/cxhtml?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined when the url param is missing', () => {
    const url = new URL('https://h.accesstrade.net/sp/cc?rk=01001xqc00op53')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const url = new URL('https://h.accesstrade.net/sp/cc?rk=01001xqc00op53&url=')

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL(
      'https://tracking.example.com/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const url = new URL(
      'https://exampleaccesstrade.net/sp/cc?rk=01001xqc00op53&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapAccesstrade(url)).toBeUndefined()
  })
})
