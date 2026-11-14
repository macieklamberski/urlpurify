import { describe, expect, it } from 'bun:test'
import { unwrapXianguo } from './xianguo.js'

describe('unwrapXianguo', () => {
  it('should extract a raw feed url', () => {
    const value = new URL('http://www.xianguo.com/subscribe.php?url=http://feed.example.com/leica')
    const expected = 'http://feed.example.com/leica'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should extract a raw https feed url', () => {
    const value = new URL('http://www.xianguo.com/subscribe.php?url=https://example.com/feed/')
    const expected = 'https://example.com/feed/'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should extract a percent-encoded url', () => {
    const value = new URL(
      'http://www.xianguo.com/subscribe.php?url=http%3A%2F%2Fwww.example.com%2Farchives%2F3434',
    )
    const expected = 'http://www.example.com/archives/3434'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should end the url before a title param', () => {
    const value = new URL(
      'http://www.xianguo.com/subscribe.php?url=http://example.com/feed/&title=%E6%B2%A1%E6%9C%89',
    )
    const expected = 'http://example.com/feed/'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should extract a twice-encoded url', () => {
    const value = new URL(
      'http://www.xianguo.com/subscribe.php?url=http%253A%252F%252Fexample.com%252Ffeed',
    )
    const expected = 'http://example.com/feed'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should extract a url on the bare domain', () => {
    const value = new URL('http://xianguo.com/subscribe.php?url=http://example.com/feed/')
    const expected = 'http://example.com/feed/'

    expect(unwrapXianguo(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('http://www.xianguo.com/subscribe.php?url=')

    expect(unwrapXianguo(value)).toBeUndefined()
  })

  it('should return undefined without a url', () => {
    const value = new URL('http://www.xianguo.com/subscribe.php')

    expect(unwrapXianguo(value)).toBeUndefined()
  })

  it('should return undefined for the digg share path', () => {
    const value = new URL(
      'http://www.xianguo.com/service/submitdigg/?link=http://example.com/Print/Article/8075_0.shtml',
    )

    expect(unwrapXianguo(value)).toBeUndefined()
  })

  it('should return undefined for subscribe.php on another host', () => {
    const value = new URL('http://example.com/subscribe.php?url=http://example.org/feed')

    expect(unwrapXianguo(value)).toBeUndefined()
  })
})
