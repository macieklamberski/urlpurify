import { describe, expect, it } from 'bun:test'
import { unwrapSspai } from './sspai.js'

describe('unwrapSspai', () => {
  it('should extract target from target param', () => {
    const value = new URL('https://sspai.com/link?target=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapSspai(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://sspai.com/link?other=value')

    expect(unwrapSspai(value)).toBeUndefined()
  })

  it('should return undefined for non-link Sspai paths', () => {
    const value = new URL('https://sspai.com/post?target=https%3A%2F%2Fexample.com')

    expect(unwrapSspai(value)).toBeUndefined()
  })

  it('should return undefined for non-Sspai hosts', () => {
    const value = new URL('https://example.com/link?target=https%3A%2F%2Fother.com')

    expect(unwrapSspai(value)).toBeUndefined()
  })
})
