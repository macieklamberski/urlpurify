import { describe, expect, it } from 'bun:test'
import { unwrapAliexpress } from './aliexpress.js'

describe('unwrapAliexpress', () => {
  it('should extract target from dl_target_url param', () => {
    const url = new URL(
      'http://s.click.aliexpress.com/deep_link.htm?aff_short_key=_seb1BI&dl_target_url=https://www.example.com/item/4000206380165.html',
    )

    expect(unwrapAliexpress(url)).toBe('https://www.example.com/item/4000206380165.html')
  })

  it('should extract target from dl_target_url param after other params', () => {
    const url = new URL(
      'https://s.click.aliexpress.com/deep_link.htm?aff_short_key=_AquJME&cn=askmeoffers&af=askmeoffers&dl_target_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAliexpress(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when dl_target_url param is missing', () => {
    const url = new URL('https://s.click.aliexpress.com/deep_link.htm?aff_short_key=_AquJME')

    expect(unwrapAliexpress(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the AliExpress host', () => {
    const url = new URL(
      'https://s.click.aliexpress.com/e/_DlCyg8n?dl_target_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAliexpress(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/deep_link.htm?dl_target_url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapAliexpress(url)).toBeUndefined()
  })
})
