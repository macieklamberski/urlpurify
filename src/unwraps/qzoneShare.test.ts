import { describe, expect, it } from 'bun:test'
import { unwrapQzoneShare } from './qzoneShare.js'

describe('unwrapQzoneShare', () => {
  it('should extract a raw url', () => {
    const value = new URL(
      'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://example.com/feed/&title=PildoLabs',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapQzoneShare(value)).toBe(expected)
  })

  it('should cut a raw url with a query at the next param', () => {
    const value = new URL(
      'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://example.com/?feed=rss2&title=ATL',
    )
    const expected = 'http://example.com/?feed=rss2'

    expect(unwrapQzoneShare(value)).toBe(expected)
  })

  it('should extract a percent-encoded url over https', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https%3A%2F%2Fexample.com%2Fpost&title=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapQzoneShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/CGI-BIN/qzshare/cgi_qzshare_onekey?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapQzoneShare(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapQzoneShare(value)).toBe(expected)
  })

  it('should return undefined for a url held only in title', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapQzoneShare(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=&title=Hello',
    )

    expect(unwrapQzoneShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://sns.qzone.qq.com/cgi-bin/qzshare/other?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapQzoneShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://user.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapQzoneShare(value)).toBeUndefined()
  })
})
