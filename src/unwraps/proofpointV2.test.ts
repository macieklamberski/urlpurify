import { describe, expect, it } from 'bun:test'
import { unwrapProofpointV2 } from './proofpointV2.js'

describe('unwrapProofpointV2', () => {
  it('should decode a v2 URL with substituted slashes', () => {
    const value = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_article&d=DwMFAg&c=abc',
    )
    const expected = 'https://example.com/article'

    expect(unwrapProofpointV2(value)).toBe(expected)
  })

  it('should decode complex percent-encoded query strings', () => {
    const value = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_path-3Fq-3Dhello-26lang-3Den',
    )
    const expected = 'https://example.com/path?q=hello&lang=en'

    expect(unwrapProofpointV2(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://urldefense.proofpoint.com/v2/url?d=DwMFAg')

    expect(unwrapProofpointV2(value)).toBeUndefined()
  })

  it('should return undefined for non-v2 paths', () => {
    const value = new URL('https://urldefense.proofpoint.com/v1/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV2(value)).toBeUndefined()
  })

  it('should return undefined for non-Proofpoint hosts', () => {
    const value = new URL('https://example.com/v2/url?u=https-3A__other.com_path')

    expect(unwrapProofpointV2(value)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_100-25off-ZZ',
    )
    const expected = 'https://example.com/100%off%ZZ'

    expect(unwrapProofpointV2(value)).toBe(expected)
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const value = new URL(
      'https://eu.urldefense.proofpoint.com/v2/url?u=https-3A__example.com_path',
    )

    expect(unwrapProofpointV2(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL('https://exampleurldefense.com/v2/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV2(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_article-23top&d=DwMFAg&c=abc',
    )
    const expected = 'https://example.com/article#top'

    expect(unwrapProofpointV2(value)).toBe(expected)
  })

  it('should decode a target whose encoded form ends in a number', () => {
    const value = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__www.example.com_maps_place_30908-2BWarder-2BSt-2C-2BSan-2BAntonio-2C-2BFL-2B33576_-4028.330544-2C-2D82.3080347-2C17z_data-3D-213m1-214d-2D82.305846&d=DwMFaQ&c=abc',
    )
    const expected =
      'https://www.example.com/maps/place/30908+Warder+St,+San+Antonio,+FL+33576/@28.330544,-82.3080347,17z/data=!3m1!4d-82.305846'

    expect(unwrapProofpointV2(value)).toBe(expected)
  })
})
