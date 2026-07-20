import { describe, expect, it } from 'bun:test'
import { unwrapHrefLi } from './hrefLi.js'

describe('unwrapHrefLi', () => {
  it('should extract the target from the query string', () => {
    const url = new URL('https://href.li/?https://example.com/post')

    expect(unwrapHrefLi(url)).toBe('https://example.com/post')
  })

  it('should keep the target query string', () => {
    const url = new URL('https://href.li/?https://example.com/post?page=2&sort=new')

    expect(unwrapHrefLi(url)).toBe('https://example.com/post?page=2&sort=new')
  })

  it('should extract the target from the www host', () => {
    const url = new URL('https://www.href.li/?https://example.com/post')

    expect(unwrapHrefLi(url)).toBe('https://example.com/post')
  })

  it('should return undefined when there is no query string', () => {
    const url = new URL('https://href.li/')

    expect(unwrapHrefLi(url)).toBeUndefined()
  })

  it('should return undefined for non-href.li hosts', () => {
    const url = new URL('https://example.com/?https://other.com')

    expect(unwrapHrefLi(url)).toBeUndefined()
  })
})
