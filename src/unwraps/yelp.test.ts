import { describe, expect, it } from 'bun:test'
import { unwrapYelp } from './yelp.js'

describe('unwrapYelp', () => {
  it('should extract target from url param on biz_redir', () => {
    const value = new URL(
      'http://www.yelp.com/biz_redir?url=http%3A%2F%2Fwww.example.com%2F&src_bizid=LmIUmXKyaWJw-KXHlyeBkA&cachebuster=1428922892&s=4818d9f8ac1c5e5b0c2c7a3a1b0a2b6f',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapYelp(value)).toBe(expected)
  })

  it('should extract target from url param on redir', () => {
    const value = new URL(
      'http://www.yelp.com/redir?url=http%3A%2F%2Fwww.example.com&s=c9611c1af8fe335d126b0aa223c7f26bb10346068235a92b0e191542313216ed',
    )
    const expected = 'http://www.example.com'

    expect(unwrapYelp(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.yelp.com/BIZ_REDIR?url=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrapYelp(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://www.yelp.com/biz_redir?src_bizid=LmIUmXKyaWJw-KXHlyeBkA')

    expect(unwrapYelp(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.yelp.com/biz/example?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapYelp(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/biz_redir?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapYelp(value)).toBeUndefined()
  })
})
