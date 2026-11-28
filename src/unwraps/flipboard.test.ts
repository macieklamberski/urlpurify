import { describe, expect, it } from 'bun:test'
import { unwrapFlipboard } from './flipboard.js'

describe('unwrapFlipboard', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://flipboard.com/redirect?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapFlipboard(value)).toBe(expected)
  })

  it('should return undefined for non-redirect Flipboard URLs', () => {
    const value = new URL('https://flipboard.com/topic/news')

    expect(unwrapFlipboard(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://flipboard.com/redirect')

    expect(unwrapFlipboard(value)).toBeUndefined()
  })

  it('should return undefined for non-Flipboard hosts', () => {
    const value = new URL('https://example.com/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapFlipboard(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://exampleflipboard.com/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapFlipboard(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const value = new URL('https://flipboard.com/redirect/ws?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapFlipboard(value)).toBeUndefined()
  })
})
