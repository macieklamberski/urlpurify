import { describe, expect, it } from 'bun:test'
import { unwrapDigidip } from './digidip.js'

describe('unwrapDigidip', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://example.digidip.net/visit?url=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapDigidip(url)).toBe('https://example.com/product')
  })

  it('should extract target from the v1 redirect path', () => {
    const url = new URL(
      'https://tracking.r.digidip.net/v1/redirect?type=url&url=https%3A%2F%2Fexample.com%2F&site_id=abc',
    )

    expect(unwrapDigidip(url)).toBe('https://example.com/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://example.digidip.net/visit?other=value')

    expect(unwrapDigidip(url)).toBeUndefined()
  })

  it('should return undefined for non-digidip hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapDigidip(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL('https://a.b.digidip.net/visit?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDigidip(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://example.digidip.net/other?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDigidip(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampledigidip.net/visit?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDigidip(url)).toBeUndefined()
  })
})
