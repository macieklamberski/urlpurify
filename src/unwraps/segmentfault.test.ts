import { describe, expect, it } from 'bun:test'
import { unwrapSegmentfault } from './segmentfault.js'

describe('unwrapSegmentfault', () => {
  it('should decode a base64 enc param', () => {
    const target = 'https://example.com/article'
    const encoded = Buffer.from(target).toString('base64')
    const url = new URL(`https://link.segmentfault.com/?enc=${encodeURIComponent(encoded)}`)

    expect(unwrapSegmentfault(url)).toBe(target)
  })

  it('should return undefined when the decoded value is not http(s)', () => {
    const encoded = Buffer.from('not-a-url').toString('base64')
    const url = new URL(`https://link.segmentfault.com/?enc=${encodeURIComponent(encoded)}`)

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })

  it('should return undefined when enc param is missing', () => {
    const url = new URL('https://link.segmentfault.com/?other=value')

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })

  it('should return undefined for non-Segmentfault hosts', () => {
    const url = new URL('https://example.com/?enc=abc')

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://go.segmentfault.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0')

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplesegmentfault.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0')

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://link.segmentfault.com/a/1?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0')

    expect(unwrapSegmentfault(url)).toBeUndefined()
  })
})
