import { describe, expect, it } from 'bun:test'
import { unwrapHashnode } from './hashnode.js'

describe('unwrapHashnode', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://hashnode.com/util/redirect?url=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapHashnode(value)).toBe(expected)
  })

  it('should return undefined for non-redirect Hashnode URLs', () => {
    const value = new URL('https://hashnode.com/community')

    expect(unwrapHashnode(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://hashnode.com/util/redirect')

    expect(unwrapHashnode(value)).toBeUndefined()
  })

  it('should return undefined for non-Hashnode hosts', () => {
    const value = new URL('https://example.com/util/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapHashnode(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://examplehashnode.com/util/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapHashnode(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const value = new URL('https://hashnode.com/utility/r?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapHashnode(value)).toBeUndefined()
  })
})
