import { describe, expect, it } from 'bun:test'
import { unwrapProofpointV2 } from './proofpointV2.js'

describe('unwrapProofpointV2', () => {
  it('should decode a v2 URL with substituted slashes', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_article&d=DwMFAg&c=abc',
    )

    expect(unwrapProofpointV2(url)).toBe('https://example.com/article')
  })

  it('should decode complex percent-encoded query strings', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_path-3Fq-3Dhello-26lang-3Den',
    )

    expect(unwrapProofpointV2(url)).toBe('https://example.com/path?q=hello&lang=en')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://urldefense.proofpoint.com/v2/url?d=DwMFAg')

    expect(unwrapProofpointV2(url)).toBeUndefined()
  })

  it('should return undefined for non-v2 paths', () => {
    const url = new URL('https://urldefense.proofpoint.com/v1/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV2(url)).toBeUndefined()
  })

  it('should return undefined for non-Proofpoint hosts', () => {
    const url = new URL('https://example.com/v2/url?u=https-3A__other.com_path')

    expect(unwrapProofpointV2(url)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v2/url?u=https-3A__example.com_100-25off-ZZ',
    )

    expect(unwrapProofpointV2(url)).toBe('https://example.com/100%off%ZZ')
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://eu.urldefense.proofpoint.com/v2/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV2(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://exampleurldefense.com/v2/url?u=https-3A__example.com_path')

    expect(unwrapProofpointV2(url)).toBeUndefined()
  })
})
