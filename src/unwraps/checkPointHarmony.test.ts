import { describe, expect, it } from 'bun:test'
import { unwrapCheckPointHarmony } from './checkPointHarmony.js'

describe('unwrapCheckPointHarmony', () => {
  it('should extract a half-encoded target from o param', () => {
    const url = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%3A//example.org/beforethepartysover&g=NWQ3N2JlOTQwYmM3NDU0YQ==&h=MTMxNmM2YWRl&p=YzJlOmtvZW5p',
    )

    expect(unwrapCheckPointHarmony(url)).toBe('https://example.org/beforethepartysover')
  })

  it('should extract the target from the regional path', () => {
    const url = new URL(
      'https://avanan.url-protection.com/v1/r01/url?o=https%3A//www.example.org/team/jeffrey/&g=YWQ2ODVkY2EwYTA1MWYzMQ==&h=YzM4NTJlMWMx',
    )

    expect(unwrapCheckPointHarmony(url)).toBe('https://www.example.org/team/jeffrey/')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://checkpoint.url-protection.com/v1/url?o=https%3A//example.org/page%3Fq%3Da%2520b%26id%3D7&g=NWQ3N2JlOTQwYmM3NDU0YQ==',
    )

    expect(unwrapCheckPointHarmony(url)).toBe('https://example.org/page?q=a%20b&id=7')
  })

  it('should extract a v2 target that carries its own query', () => {
    const url = new URL(
      'https://protect.checkpoint.com/v2/r01/___https:/example.org/v1/url?k=31323334&u=https%3A%2F%2Fexample.org%2Fletter.pdf___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(url)).toBe(
      'https:/example.org/v1/url?k=31323334&u=https%3A%2F%2Fexample.org%2Fletter.pdf',
    )
  })

  it('should extract a v2 target without a region segment', () => {
    const url = new URL(
      'https://protect.checkpoint.com/v2/___https://www.example.org/criminal-defense/___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(url)).toBe('https://www.example.org/criminal-defense/')
  })

  it('should keep a fragment written after the v2 signature', () => {
    const url = new URL(
      'https://protect.checkpoint.com/v2/r01/___https://www.example.org/news-releases/new-flavors-302420491.html___.YzJ1OmNhcmxidWRkaWdjb21wYW55OmM6b2ZmaWNlMzY1X2VtYWlsc19#financial-modal',
    )

    expect(unwrapCheckPointHarmony(url)).toBe(
      'https://www.example.org/news-releases/new-flavors-302420491.html#financial-modal',
    )
  })

  it('should restore the star escapes in a v2 target path', () => {
    const url = new URL(
      'https://protect.checkpoint.com/v2/r01/___https://links.example.com/CL0/https:*2F*2Fexample.org*2Ftravel/1/0100019f___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(url)).toBe(
      'https://links.example.com/CL0/https:%2F%2Fexample.org%2Ftravel/1/0100019f',
    )
  })

  it('should return undefined for a v2 link without the signature', () => {
    const url = new URL('https://protect.checkpoint.com/v2/r01/___https://example.org/page___')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for a v2 path under a prefix', () => {
    const url = new URL(
      'https://protect.checkpoint.com/x/v2/___https://example.org/page___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for the v1 path on the v2 host', () => {
    const url = new URL('https://protect.checkpoint.com/v1/url?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for a v2 non-http target', () => {
    const url = new URL(
      'https://protect.checkpoint.com/v2/___javascript:alert(1)___.YzJ1OnN0YXRlOmM6bzo5NzYzODYxMWI2ZjM5NTRhZjBmNDViZDFm',
    )

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://checkpoint.url-protection.com/v1/report?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for a region segment without digits', () => {
    const url = new URL('https://checkpoint.url-protection.com/v1/rx/url?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for the path with a trailing segment', () => {
    const url = new URL('https://checkpoint.url-protection.com/v1/url/x?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL('https://checkpoint.url-protection.com/x/v1/url?o=https%3A//example.org/')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined when o param is missing', () => {
    const url = new URL('https://checkpoint.url-protection.com/v1/url?g=NWQ3N2JlOTQwYmM3NDU0YQ==')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })

  it('should return undefined when o param is empty', () => {
    const url = new URL('https://checkpoint.url-protection.com/v1/url?o=')

    expect(unwrapCheckPointHarmony(url)).toBeUndefined()
  })
})
