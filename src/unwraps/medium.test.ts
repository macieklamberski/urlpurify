import { describe, expect, it } from 'bun:test'
import { unwrapMedium } from './medium.js'

describe('unwrapMedium', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://medium.com/r/?url=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapMedium(url)).toBe('https://example.com/article')
  })

  it('should return undefined for non-redirect Medium URLs', () => {
    const url = new URL('https://medium.com/@author/article-slug')

    expect(unwrapMedium(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://medium.com/r/')

    expect(unwrapMedium(url)).toBeUndefined()
  })

  it('should return undefined for non-Medium hosts', () => {
    const url = new URL('https://example.com/r/?url=https%3A%2F%2Fother.com')

    expect(unwrapMedium(url)).toBeUndefined()
  })
})
