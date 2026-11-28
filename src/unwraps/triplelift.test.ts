import { describe, expect, it } from 'bun:test'
import { unwrapTriplelift } from './triplelift.js'

describe('unwrapTriplelift', () => {
  it('should extract target from redir param', () => {
    const value = new URL(
      'https://eb2.3lift.com/pass?tl_clickthrough=true&redir=https%3A%2F%2Fwww.example.com%2Frs%2Fu1d9luqnrqww%2Fb1_triplelift',
    )
    const expected = 'https://www.example.com/rs/u1d9luqnrqww/b1_triplelift'

    expect(unwrapTriplelift(value)).toBe(expected)
  })

  it('should return undefined when redir param is missing', () => {
    const value = new URL('https://eb2.3lift.com/pass?tl_clickthrough=true')

    expect(unwrapTriplelift(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the TripleLift host', () => {
    const value = new URL(
      'https://eb2.3lift.com/mbi?tl_clickthrough=true&redir=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTriplelift(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/pass?tl_clickthrough=true&redir=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTriplelift(value)).toBeUndefined()
  })
})
