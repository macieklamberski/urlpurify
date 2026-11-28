import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapDigidip } from './digidip.js'

describe('unwrapDigidip', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://example.digidip.net/visit?url=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapDigidip(value)).toBe(expected)
  })

  it('should extract target from the v1 redirect path', () => {
    const value = new URL(
      'https://tracking.r.digidip.net/v1/redirect?type=url&url=https%3A%2F%2Fexample.com%2F&site_id=abc',
    )
    const expected = 'https://example.com/'

    expect(unwrapDigidip(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://example.digidip.net/visit?other=value')

    expect(unwrapDigidip(value)).toBeUndefined()
  })

  it('should return undefined for non-digidip hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapDigidip(value)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const value = new URL('https://a.b.digidip.net/visit?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapDigidip(value)).toBe(expected)
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://example.digidip.net/other?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDigidip(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://exampledigidip.net/visit?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDigidip(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapDigidip)).toBe(true)
  })
})
