import { describe, expect, it } from 'bun:test'
import { unwrapPocket } from './pocket.js'

describe('unwrapPocket', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://getpocket.com/redirect?url=https%3A%2F%2Fexample.com%2Fstory')

    expect(unwrapPocket(url)).toBe('https://example.com/story')
  })

  it('should return undefined for non-redirect Pocket URLs', () => {
    const url = new URL('https://getpocket.com/explore')

    expect(unwrapPocket(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://getpocket.com/redirect')

    expect(unwrapPocket(url)).toBeUndefined()
  })

  it('should return undefined for non-Pocket hosts', () => {
    const url = new URL('https://example.com/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapPocket(url)).toBeUndefined()
  })
})
