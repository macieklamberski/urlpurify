import { describe, expect, it } from 'bun:test'
import { unwrapDouban } from './douban.js'

describe('unwrapDouban', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://www.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapDouban(url)).toBe('https://example.com/article')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.douban.com/link2/?other=value')

    expect(unwrapDouban(url)).toBeUndefined()
  })

  it('should return undefined for non-link2 Douban paths', () => {
    const url = new URL('https://www.douban.com/group?url=https%3A%2F%2Fexample.com')

    expect(unwrapDouban(url)).toBeUndefined()
  })

  it('should return undefined for non-Douban hosts', () => {
    const url = new URL('https://example.com/link2/?url=https%3A%2F%2Fother.com')

    expect(unwrapDouban(url)).toBeUndefined()
  })
})
