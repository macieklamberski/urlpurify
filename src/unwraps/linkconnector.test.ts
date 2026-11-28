import { describe, expect, it } from 'bun:test'
import { unwrapLinkconnector } from './linkconnector.js'

describe('unwrapLinkconnector', () => {
  it('should extract a percent-encoded target from url param', () => {
    const value = new URL(
      'http://www.linkconnector.com/ta.php?lc=146593000012005219&url=https%3A%2F%2Fwww.example.com%2Fsilver%2Fsilver-bars&lcpt=0&lcpf=3',
    )
    const expected = 'https://www.example.com/silver/silver-bars'

    expect(unwrapLinkconnector(value)).toBe(expected)
  })

  it('should extract a half-encoded target from url param', () => {
    const value = new URL(
      'http://www.linkconnector.com/ta.php?lc=138757056961005237&url=http%3A//www.example.com/search/portfolio/1198937',
    )
    const expected = 'http://www.example.com/search/portfolio/1198937'

    expect(unwrapLinkconnector(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://www.linkconnector.com/ta.php?lc=146593000012005219&lcpt=0')

    expect(unwrapLinkconnector(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the LinkConnector host', () => {
    const value = new URL(
      'http://www.linkconnector.com/traffic_affiliate.php?lc=1&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkconnector(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'http://example.com/ta.php?lc=146593000012005219&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLinkconnector(value)).toBeUndefined()
  })
})
