import { describe, expect, it } from 'bun:test'
import { unwrapButton } from './button.js'

describe('unwrapButton', () => {
  it('should extract target from btn_url param', () => {
    const value = new URL(
      'https://r.amzlink.to/?btn_url=https%3A%2F%2Fwww.example.com%2Fstores%2Fauthor%2FB0D66SYTWX%3Fref%3Dap_rdr&btn_ref=org-433bb3c1e5d7f2a8',
    )
    const expected = 'https://www.example.com/stores/author/B0D66SYTWX?ref=ap_rdr'

    expect(unwrapButton(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://r.bttn.io/?btn_url=https://example.co.uk&btn_ref=org-6658d51db36e0f38&btn_reach_pub=8226461',
    )
    const expected = 'https://example.co.uk'

    expect(unwrapButton(value)).toBe(expected)
  })

  it('should return undefined when btn_url param is missing', () => {
    const value = new URL('https://r.bttn.io/?btn_ref=org-6658d51db36e0f38')

    expect(unwrapButton(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://r.bttn.io/etsy/listing/850442886?btn_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapButton(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/?btn_url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapButton(value)).toBeUndefined()
  })
})
