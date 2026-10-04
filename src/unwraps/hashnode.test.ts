import { describe, expect, it } from 'bun:test'
import { unwrapHashnode } from './hashnode.js'

describe('unwrapHashnode', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://hashnode.com/util/redirect?url=https%3A%2F%2Fexample.com%2Farticle',
    )

    expect(unwrapHashnode(url)).toBe('https://example.com/article')
  })

  it('should return undefined for non-redirect Hashnode URLs', () => {
    const url = new URL('https://hashnode.com/community')

    expect(unwrapHashnode(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://hashnode.com/util/redirect')

    expect(unwrapHashnode(url)).toBeUndefined()
  })

  it('should return undefined for non-Hashnode hosts', () => {
    const url = new URL('https://example.com/util/redirect?url=https%3A%2F%2Fother.com')

    expect(unwrapHashnode(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www.hashnode.com/util/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapHashnode(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplehashnode.com/util/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapHashnode(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const url = new URL('https://hashnode.com/utility/r?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapHashnode(url)).toBeUndefined()
  })
})
