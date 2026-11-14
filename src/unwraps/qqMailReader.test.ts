import { describe, expect, it } from 'bun:test'
import { unwrapQqMailReader } from './qqMailReader.js'

describe('unwrapQqMailReader', () => {
  it('should extract a raw feed from the u param', () => {
    const value = new URL('http://mail.qq.com/cgi-bin/feed?u=http://feed.feedsky.com/leica')
    const expected = 'http://feed.feedsky.com/leica'

    expect(unwrapQqMailReader(value)).toBe(expected)
  })

  it('should keep the query of a raw feed', () => {
    const value = new URL(
      'https://mail.qq.com/cgi-bin/feed?u=http://www.ket.net.cn/feed/rss.php?mid=13',
    )
    const expected = 'http://www.ket.net.cn/feed/rss.php?mid=13'

    expect(unwrapQqMailReader(value)).toBe(expected)
  })

  it('should extract an https feed', () => {
    const value = new URL('http://mail.qq.com/cgi-bin/feed?u=https://www.nbla.cn/feed_php.xml')
    const expected = 'https://www.nbla.cn/feed_php.xml'

    expect(unwrapQqMailReader(value)).toBe(expected)
  })

  it('should decode a percent-encoded feed', () => {
    const value = new URL(
      'https://mail.qq.com/cgi-bin/feed?u=http%3A%2F%2Ffeed.feedsky.com%2Fleica',
    )
    const expected = 'http://feed.feedsky.com/leica'

    expect(unwrapQqMailReader(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://mail.qq.com/CGI-BIN/Feed?u=http://feed.feedsky.com/leica')
    const expected = 'http://feed.feedsky.com/leica'

    expect(unwrapQqMailReader(value)).toBe(expected)
  })

  it('should return undefined when the u param is missing', () => {
    const value = new URL('https://mail.qq.com/cgi-bin/feed?sid=e6tvxdAtN0XOUGoz')

    expect(unwrapQqMailReader(value)).toBeUndefined()
  })

  it('should return undefined for another cgi-bin page', () => {
    const value = new URL('https://mail.qq.com/cgi-bin/mail_spam?url=https://example.com/page')

    expect(unwrapQqMailReader(value)).toBeUndefined()
  })

  it('should return undefined for the u param on another host', () => {
    const value = new URL('https://example.com/cgi-bin/feed?u=http://feed.feedsky.com/leica')

    expect(unwrapQqMailReader(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplemail.qq.com/cgi-bin/feed?u=http://feed.feedsky.com/leica')

    expect(unwrapQqMailReader(value)).toBeUndefined()
  })
})
