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

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL('https://book.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampledouban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(url)).toBeUndefined()
  })

  it('should extract target from dongxi.douban.com', () => {
    const url = new URL('https://dongxi.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(url)).toBe('https://example.com/page')
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://movie.douban.com/link2/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDouban(url)).toBeUndefined()
  })
})
