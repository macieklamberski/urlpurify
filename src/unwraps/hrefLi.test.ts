import { describe, expect, it } from 'bun:test'
import { unwrapHrefLi } from './hrefLi.js'

describe('unwrapHrefLi', () => {
  it('should extract the target from the query string', () => {
    const value = new URL('https://href.li/?https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapHrefLi(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL('https://href.li/?https://example.com/post?page=2&sort=new')
    const expected = 'https://example.com/post?page=2&sort=new'

    expect(unwrapHrefLi(value)).toBe(expected)
  })

  it('should keep the target fragment', () => {
    const value = new URL('https://href.li/?https://example.com/post#section')
    const expected = 'https://example.com/post#section'

    expect(unwrapHrefLi(value)).toBe(expected)
  })

  it('should return undefined when there is no query string', () => {
    const value = new URL('https://href.li/')

    expect(unwrapHrefLi(value)).toBeUndefined()
  })

  it('should return undefined for non-href.li hosts', () => {
    const value = new URL('https://example.com/?https://other.com')

    expect(unwrapHrefLi(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://href.li/go/?https://example.com/post')

    expect(unwrapHrefLi(value)).toBeUndefined()
  })

  it('should decode an encoded target', () => {
    const value = new URL('https://href.li/?https%3A%2F%2Fexample.com%2Fpost%3Fa%3D1%26b%3D2')
    const expected = 'https://example.com/post?a=1&b=2'

    expect(unwrapHrefLi(value)).toBe(expected)
  })
})
