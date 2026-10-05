import { describe, expect, it } from 'bun:test'
import { unwrapSspai } from './sspai.js'

describe('unwrapSspai', () => {
  it('should extract target from target param', () => {
    const url = new URL('https://sspai.com/link?target=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapSspai(url)).toBe('https://example.com/article')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://sspai.com/link?other=value')

    expect(unwrapSspai(url)).toBeUndefined()
  })

  it('should return undefined for non-link Sspai paths', () => {
    const url = new URL('https://sspai.com/post?target=https%3A%2F%2Fexample.com')

    expect(unwrapSspai(url)).toBeUndefined()
  })

  it('should return undefined for non-Sspai hosts', () => {
    const url = new URL('https://example.com/link?target=https%3A%2F%2Fother.com')

    expect(unwrapSspai(url)).toBeUndefined()
  })
})
