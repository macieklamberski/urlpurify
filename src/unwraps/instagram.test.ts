import { describe, expect, it } from 'bun:test'
import { unwrapInstagramShim } from './instagram.js'

describe('unwrapInstagramShim', () => {
  it('should extract target from u param on l.instagram.com', () => {
    const url = new URL('https://l.instagram.com/?u=https%3A%2F%2Fexample.com%2Fpage&e=ABC&s=1')

    expect(unwrapInstagramShim(url)).toBe('https://example.com/page')
  })

  it('should extract target from u param on lm.instagram.com', () => {
    const url = new URL('https://lm.instagram.com/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapInstagramShim(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://l.instagram.com/?e=ABC')

    expect(unwrapInstagramShim(url)).toBeUndefined()
  })

  it('should return undefined for non-Instagram hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapInstagramShim(url)).toBeUndefined()
  })
})
