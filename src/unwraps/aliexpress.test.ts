import { describe, expect, it } from 'bun:test'
import { unwrapAliexpress } from './aliexpress.js'

describe('unwrapAliexpress', () => {
  it('should extract target from dl_target_url param', () => {
    const value = new URL(
      'http://s.click.aliexpress.com/deep_link.htm?aff_short_key=_seb1BI&dl_target_url=https://www.example.com/item/4000206380165.html',
    )
    const expected = 'https://www.example.com/item/4000206380165.html'

    expect(unwrapAliexpress(value)).toBe(expected)
  })

  it('should extract target from dl_target_url param after other params', () => {
    const value = new URL(
      'https://s.click.aliexpress.com/deep_link.htm?aff_short_key=_AquJME&cn=askmeoffers&af=askmeoffers&dl_target_url=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapAliexpress(value)).toBe(expected)
  })

  it('should return undefined when dl_target_url param is missing', () => {
    const value = new URL('https://s.click.aliexpress.com/deep_link.htm?aff_short_key=_AquJME')

    expect(unwrapAliexpress(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the AliExpress host', () => {
    const value = new URL(
      'https://s.click.aliexpress.com/e/_DlCyg8n?dl_target_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAliexpress(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/deep_link.htm?dl_target_url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapAliexpress(value)).toBeUndefined()
  })
})
