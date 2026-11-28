import { describe, expect, it } from 'bun:test'
import { unwrapPocket } from './pocket.js'

describe('unwrapPocket', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://getpocket.com/redirect?url=https%3A%2F%2Fexample.com%2Fstory')
    const expected = 'https://example.com/story'

    expect(unwrapPocket(value)).toBe(expected)
  })

  it('should return undefined for non-redirect Pocket URLs', () => {
    const value = new URL('https://getpocket.com/explore')

    expect(unwrapPocket(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://getpocket.com/redirect')

    expect(unwrapPocket(value)).toBeUndefined()
  })

  it('should return undefined for non-Pocket hosts', () => {
    const value = new URL('https://example.com/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapPocket(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL(
      'https://examplegetpocket.com/redirect?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapPocket(value)).toBeUndefined()
  })
})
