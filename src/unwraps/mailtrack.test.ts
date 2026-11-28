import { describe, expect, it } from 'bun:test'
import { unwrapMailtrack } from './mailtrack.js'

describe('unwrapMailtrack', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://mailtrack.io/?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapMailtrack(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://mailtrack.io/?other=value')

    expect(unwrapMailtrack(value)).toBeUndefined()
  })

  it('should return undefined for non-Mailtrack hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapMailtrack(value)).toBeUndefined()
  })

  it('should extract target from the trace link path', () => {
    const value = new URL(
      'https://mailtrack.io/trace/link/fb3ab72f54a6270390a1f71c50d3be494bc08008?url=https%3A%2F%2Fexample.com%2Fpost&userId=2442564&signature=4b',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMailtrack(value)).toBe(expected)
  })

  it('should extract target from the link path', () => {
    const value = new URL(
      'https://mailtrack.io/link/024ff2f6fb251a7eb9c904ddc02769659ad3ff99?url=https%3A%2F%2Fexample.com%2Fpost&userId=1577531',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMailtrack(value)).toBe(expected)
  })

  it('should extract target from the short link path', () => {
    const value = new URL(
      'https://mailtrack.io/l/024ff2f6fb251a7eb9c904ddc02769659ad3ff99?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMailtrack(value)).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://mailtrack.io/pricing?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailtrack(value)).toBeUndefined()
  })
})
