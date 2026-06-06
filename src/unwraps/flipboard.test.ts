import { describe, expect, it } from 'bun:test'
import { unwrapFlipboard } from './flipboard.js'

describe('unwrapFlipboard', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://flipboard.com/redirect?url=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapFlipboard(url)).toBe('https://example.com/article')
  })

  it('should return undefined for non-redirect Flipboard URLs', () => {
    const url = new URL('https://flipboard.com/topic/news')

    expect(unwrapFlipboard(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://flipboard.com/redirect')

    expect(unwrapFlipboard(url)).toBeUndefined()
  })

  it('should return undefined for non-Flipboard hosts', () => {
    const url = new URL('https://example.com/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapFlipboard(url)).toBeUndefined()
  })
})
