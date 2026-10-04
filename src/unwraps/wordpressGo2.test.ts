import { describe, expect, it } from 'bun:test'
import { unwrapUrl } from '../clean.js'
import { unwrapWordpressGo2 } from './wordpressGo2.js'

describe('unwrapWordpressGo2', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'http://go2.wordpress.com/?id=725X1342&site=blog.wordpress.com&url=http%3A%2F%2Fexample.com%2Fcommunity%2Fnews',
    )

    expect(unwrapWordpressGo2(url)).toBe('http://example.com/community/news')
  })

  it('should extract target with sref and xs params around it', () => {
    const url = new URL(
      'http://go2.wordpress.com/?id=725X584219&site=blog.wordpress.com&xs=1&url=http%3A%2F%2Fexample.com%2Fpodcast%2Fepisode-1&sref=http%3A%2F%2Fblog.wordpress.com%2F2010%2F08%2F09%2Fpost%2F',
    )

    expect(unwrapWordpressGo2(url)).toBe('http://example.com/podcast/episode-1')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://go2.wordpress.com/?id=725X1342&site=blog.wordpress.com&url=http://example.com/news/crop-circles.html&sref=http://blog.wordpress.com/post/',
    )

    expect(unwrapWordpressGo2(url)).toBe('http://example.com/news/crop-circles.html')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'http://go2.wordpress.com/?id=725X1342&site=blog.wordpress.com&url=http%3A%2F%2Fexample.com%2Fgp%2Fproduct%3Fid%3D13%26aid%3D413%26type%3DData%2520Sheets',
    )

    expect(unwrapWordpressGo2(url)).toBe(
      'http://example.com/gp/product?id=13&aid=413&type=Data%20Sheets',
    )
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://go2.wordpress.com/?id=725X1342&site=blog.wordpress.com')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('http://go2.wordpress.com/?id=725X1342&url=')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should leave a non-http target unwrapped', () => {
    const url = 'http://go2.wordpress.com/?id=725X1342&url=ftp%3A%2F%2Fexample.com%2Ffile'

    expect(unwrapUrl(url, [unwrapWordpressGo2])).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://go2.wordpress.com/redirect?id=725X1342&url=http%3A%2F%2Fexample.com',
    )

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should return undefined on a blog subdomain', () => {
    const url = new URL('http://blog.wordpress.com/?id=725X1342&url=http%3A%2F%2Fexample.com')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should return undefined on a subdomain of the host', () => {
    const url = new URL('http://blog.go2.wordpress.com/?id=725X1342&url=http%3A%2F%2Fexample.com')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('http://go2.example.com/?id=725X1342&url=http%3A%2F%2Fexample.org')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('http://go2.wordpress.com.example.com/?url=http%3A%2F%2Fexample.org')

    expect(unwrapWordpressGo2(url)).toBeUndefined()
  })
})
