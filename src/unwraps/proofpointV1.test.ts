import { describe, expect, it } from 'bun:test'
import { unwrapProofpointV1 } from './proofpointV1.js'

describe('unwrapProofpointV1', () => {
  it('should return the target of a v1 url', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v1/url?u=http://lists.conlang.org/listinfo.cgi/lcc6-info-conlang.org&k=fnjxfM5VUJirbDP%2B2MM0zg%3D%3D%0A',
    )
    const expected = 'http://lists.conlang.org/listinfo.cgi/lcc6-info-conlang.org'

    expect(unwrapProofpointV1(url)).toBe(expected)
  })

  it('should decode the percent-encoded query of the target', () => {
    const url = new URL(
      'https://urldefense.proofpoint.com/v1/url?u=http://ancestry.qualtrics.com/SE/?SID%3DSV_2gGn6AJi7S0LFJj&k=key',
    )
    const expected = 'http://ancestry.qualtrics.com/SE/?SID=SV_2gGn6AJi7S0LFJj'

    expect(unwrapProofpointV1(url)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://urldefense.proofpoint.com/v1/url?k=key')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined for non-v1 paths', () => {
    const url = new URL('https://urldefense.proofpoint.com/v2/url?u=https://example.com_path')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined for non-Proofpoint hosts', () => {
    const url = new URL('https://example.com/v1/url?u=https://other.com_path')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined on urldefense.us', () => {
    const url = new URL('https://urldefense.us/v1/url?u=https://example.com_path_to_article&k=key')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL(
      'https://exampleurldefense.com/v1/url?u=https://example.com_path_to_article',
    )

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined on urldefense.com', () => {
    const url = new URL('https://urldefense.com/v1/url?u=https-3A__example.com_post')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })

  it('should return undefined for another proofpoint.com host', () => {
    const url = new URL('https://other.proofpoint.com/v1/url?u=https-3A__example.com_post')

    expect(unwrapProofpointV1(url)).toBeUndefined()
  })
})
