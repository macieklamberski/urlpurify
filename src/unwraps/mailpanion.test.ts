import { describe, expect, it } from 'bun:test'
import { unwrapMailpanion } from './mailpanion.js'

describe('unwrapMailpanion', () => {
  it('should extract target from destination param', () => {
    const value = new URL(
      'https://mailpanion.com/?destination=https%3A%2F%2Fexample.com%2Fnewsletter',
    )
    const expected = 'https://example.com/newsletter'

    expect(unwrapMailpanion(value)).toBe(expected)
  })

  it('should return undefined when destination param is missing', () => {
    const value = new URL('https://mailpanion.com/?other=value')

    expect(unwrapMailpanion(value)).toBeUndefined()
  })

  it('should return undefined for non-Mailpanion hosts', () => {
    const value = new URL('https://example.com/?destination=https%3A%2F%2Fother.com')

    expect(unwrapMailpanion(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://mailpanion.com/other?destination=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMailpanion(value)).toBeUndefined()
  })
})
