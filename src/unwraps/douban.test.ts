import { describe, expect, it } from 'bun:test'
import { unwrapDouban } from './douban.js'

describe('unwrapDouban', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://www.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapDouban(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://www.douban.com/link2/?other=value')

    expect(unwrapDouban(value)).toBeUndefined()
  })

  it('should return undefined for non-link2 Douban paths', () => {
    const value = new URL('https://www.douban.com/group?url=https%3A%2F%2Fexample.com')

    expect(unwrapDouban(value)).toBeUndefined()
  })

  it('should return undefined for non-Douban hosts', () => {
    const value = new URL('https://example.com/link2/?url=https%3A%2F%2Fother.com')

    expect(unwrapDouban(value)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const value = new URL('https://book.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapDouban(value)).toBe(expected)
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://exampledouban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(value)).toBeUndefined()
  })

  it('should extract target from dongxi.douban.com', () => {
    const value = new URL('https://dongxi.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapDouban(value)).toBe(expected)
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://movie.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(value)).toBeUndefined()
  })
})
