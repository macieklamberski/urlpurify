import { describe, expect, it } from 'bun:test'
import { unwrapNarrativ } from './narrativ.js'

describe('unwrapNarrativ', () => {
  it('should extract target from url param on narrativ.com', () => {
    const url = new URL(
      'https://narrativ.com/api/v0/client_redirect?url=https%3A%2F%2Fexample.com%2Fbuy',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/buy')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://narrativ.com/api/v0/client_redirect?other=value')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should return undefined for non-Narrativ hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should extract target from the redirect path', () => {
    const url = new URL(
      'https://events.release.narrativ.com/api/v0/redirect/?url=https%3A%2F%2Fexample.com%2Fpost&a=1750175743820128851',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/post')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://api.narrativ.com/api/v0/other?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapNarrativ(url)).toBeUndefined()
  })
})
