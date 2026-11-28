import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapSegmentfault } from './segmentfault.js'

describe('unwrapSegmentfault', () => {
  it('should decode a base64 enc param', () => {
    const target = 'https://example.com/article'
    const encoded = Buffer.from(target).toString('base64')
    const value = new URL(`https://link.segmentfault.com/?enc=${encodeURIComponent(encoded)}`)

    expect(unwrapSegmentfault(value)).toBe(target)
  })

  it('should keep the wrapper when the decoded value is not a url', () => {
    const encoded = Buffer.from('not-a-url').toString('base64')
    const value = `https://link.segmentfault.com/?enc=${encodeURIComponent(encoded)}`

    expect(purifyUrl(value, { unwrappers: [unwrapSegmentfault] })).toBe(value)
  })

  it('should return undefined when enc param is missing', () => {
    const value = new URL('https://link.segmentfault.com/?other=value')

    expect(unwrapSegmentfault(value)).toBeUndefined()
  })

  it('should return undefined for non-Segmentfault hosts', () => {
    const value = new URL('https://example.com/?enc=abc')

    expect(unwrapSegmentfault(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://link.segmentfault.com/a/1?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0')

    expect(unwrapSegmentfault(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://link.segmentfault.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9hcnRpY2xlI3RvcA%3D%3D',
    )
    const expected = 'https://example.com/article#top'

    expect(unwrapSegmentfault(value)).toBe(expected)
  })
})
