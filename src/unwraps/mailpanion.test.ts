import { describe, expect, it } from 'bun:test'
import { unwrapMailpanion } from './mailpanion.js'

describe('unwrapMailpanion', () => {
  it('should extract target from destination param', () => {
    const url = new URL(
      'https://mailpanion.com/?destination=https%3A%2F%2Fexample.com%2Fnewsletter',
    )

    expect(unwrapMailpanion(url)).toBe('https://example.com/newsletter')
  })

  it('should return undefined when destination param is missing', () => {
    const url = new URL('https://mailpanion.com/?other=value')

    expect(unwrapMailpanion(url)).toBeUndefined()
  })

  it('should return undefined for non-Mailpanion hosts', () => {
    const url = new URL('https://example.com/?destination=https%3A%2F%2Fother.com')

    expect(unwrapMailpanion(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://mailpanion.com/other?destination=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailpanion(url)).toBeUndefined()
  })
})
