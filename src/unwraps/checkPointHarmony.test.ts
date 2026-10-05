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
