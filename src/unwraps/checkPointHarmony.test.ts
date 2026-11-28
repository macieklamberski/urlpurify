import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapCheckPointHarmony } from './checkPointHarmony.js'

describe('unwrapCheckPointHarmony', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://protect.checkpoint.com/v2/___www.example.com/page___.YzJ1OmFiYw'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapCheckPointHarmony] })).toBe(expected)
  })

  it('should extract a half-encoded target from o param', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%3A//example.org/beforethepartysover&g=NWQ3N2JlOTQwYmM3NDU0YQ==&h=MTMxNmM2YWRl&p=YzJlOmtvZW5p',
    )
    const expected = 'https://example.org/beforethepartysover'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%253A%252F%252Fexample.org%252Fpage&g=NWQ3N2JlOTQwYmM3NDU0YQ==&h=MTMxNmM2YWRl&p=YzJlOmtvZW5p',
    )
    const expected = 'https://example.org/page'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https://example.org/search/a+b&g=NWQ3N2JlOTQwYmM3NDU0YQ==&h=MTMxNmM2YWRl&p=YzJlOmtvZW5p',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should extract the target from the regional path', () => {
    const value = new URL(
      'https://avanan.url-protection.com/v1/r01/url?o=https%3A//www.example.org/team/jeffrey/&g=YWQ2ODVkY2EwYTA1MWYzMQ==&h=YzM4NTJlMWMx',
    )
    const expected = 'https://www.example.org/team/jeffrey/'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%3A//example.org/page%3Fq%3Da%2520b%26id%3D7&g=NWQ3N2JlOTQwYmM3NDU0YQ==',
    )
    const expected = 'https://example.org/page?q=a%20b&id=7'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should extract a v2 target that carries its own query', () => {
    const value = new URL(
      'https://protect.checkpoint.com/v2/r01/___https:/example.org/v1/url?k=31323334&u=https%3A%2F%2Fexample.org%2Fletter.pdf___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )
    const expected = 'https:/example.org/v1/url?k=31323334&u=https%3A%2F%2Fexample.org%2Fletter.pdf'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should extract a v2 target without a region segment', () => {
    const value = new URL(
      'https://protect.checkpoint.com/v2/___https://www.example.org/criminal-defense/___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )
    const expected = 'https://www.example.org/criminal-defense/'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should keep the link fragment after a v1 target', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%3A%2F%2Fwww.example.org%2Fpage#section',
    )
    const expected = 'https://www.example.org/page#section'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should add the link fragment after an escaped hash in a v2 target', () => {
    const value = new URL(
      'https://protect.checkpoint.com/v2/___https://www.example.org/page*23own___.YzJ1OmFiYw#link',
    )
    const expected = 'https://www.example.org/page%23own#link'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should keep a fragment written after the v2 signature', () => {
    const value = new URL(
      'https://protect.checkpoint.com/v2/r01/___https://www.example.org/news-releases/new-flavors-302420491.html___.YzJ1OmNhcmxidWRkaWdjb21wYW55OmM6b2ZmaWNlMzY1X2VtYWlsc19#financial-modal',
    )
    const expected =
      'https://www.example.org/news-releases/new-flavors-302420491.html#financial-modal'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should restore the star escapes in a v2 target path', () => {
    const value = new URL(
      'https://protect.checkpoint.com/v2/r01/___https://links.example.com/CL0/https:*2F*2Fexample.org*2Ftravel/1/0100019f___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )
    const expected = 'https://links.example.com/CL0/https:%2F%2Fexample.org%2Ftravel/1/0100019f'

    expect(unwrapCheckPointHarmony(value)).toBe(expected)
  })

  it('should return undefined for a v2 link without the signature', () => {
    const value = new URL('https://protect.checkpoint.com/v2/r01/___https://example.org/page___')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined for a v2 path under a prefix', () => {
    const value = new URL(
      'https://protect.checkpoint.com/x/v2/___https://example.org/page___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined for the v1 path on the v2 host', () => {
    const value = new URL('https://protect.checkpoint.com/v1/url?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should keep the wrapper for a v2 non-http target', () => {
    const value =
      'https://protect.checkpoint.com/v2/___javascript:alert(1)___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm'

    expect(purifyUrl(value, { unwrappers: [unwrapCheckPointHarmony] })).toBe(value)
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/report?o=https%3A//example.org/',
    )

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined for a region segment without digits', () => {
    const value = new URL(
      'https://checkpoint.url-protection.com/v1/rx/url?o=https%3A//example.org/',
    )

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const value = new URL('https://checkpoint.url-protection.com/v1/url/x?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const value = new URL('https://checkpoint.url-protection.com/x/v1/url?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined when o param is missing', () => {
    const value = new URL('https://checkpoint.url-protection.com/v1/url?g=NWQ3N2JlOTQwYmM3NDU0YQ==')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })

  it('should return undefined when o param is empty', () => {
    const value = new URL('https://checkpoint.url-protection.com/v1/url?o=')

    expect(unwrapCheckPointHarmony(value)).toBeUndefined()
  })
})
