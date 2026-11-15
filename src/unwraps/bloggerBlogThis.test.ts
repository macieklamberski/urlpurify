import { describe, expect, it } from 'bun:test'
import { unwrapBloggerBlogThis } from './bloggerBlogThis.js'

describe('unwrapBloggerBlogThis', () => {
  it('should extract the target from blog_this.pyra', () => {
    const value = new URL(
      'http://www.blogger.com/blog_this.pyra?t=&u=http%3A%2F%2Fwww.example.com%2Fnwsrm%2Ftxtps%2F2016%2Ftfsk15-eng.html%3Frss&n=Do%20you%20owe%20income%20tax%3F%20He',
    )
    const expected = 'http://www.example.com/nwsrm/txtps/2016/tfsk15-eng.html?rss'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract the target from blog-this.g', () => {
    const value = new URL(
      'http://www.blogger.com/blog-this.g?t=&u=http%3A//www.example.com/2010/an-almost-complete-list-of-global-css-reset-styles/&n=An%20%28Almost%29%20Complete%20List%20of',
    )
    const expected =
      'http://www.example.com/2010/an-almost-complete-list-of-global-css-reset-styles/'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract the target on the bare host', () => {
    const value = new URL(
      'http://blogger.com/blog-this.g?n=%D0%9E%D1%87%D0%B5%D1%80%D0%B5%D0%B4%D0%BD%D0%B0%D1%8F&u=http%3A%2F%2Fwww.example.com%2Ftopic%2F1818773-ocherednaya-peredelka-fufajka%3Fvr%3D1%26inside%3D0',
    )
    const expected =
      'http://www.example.com/topic/1818773-ocherednaya-peredelka-fufajka?vr=1&inside=0'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract the target on www2.blogger.com', () => {
    const value = new URL(
      'http://www2.blogger.com/blog-this.g?t=&u=http%3A%2F%2Fblog.example.com%2F2007%2F04%2Fblog-post_9604.html%23links&n=%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%8A%D1%80',
    )
    const expected = 'http://blog.example.com/2007/04/blog-post_9604.html#links'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract the target on draft.blogger.com', () => {
    const value = new URL(
      'https://draft.blogger.com/blog-this.g?u=https%3A%2F%2Fexample.com%2Fpost&n=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract an unencoded target up to the next param', () => {
    const value = new URL(
      'http://www.blogger.com/blog_this.pyra?t&u=http://example.com/blog/?p=27&n=Testimonial+-+Must+See&pli=1',
    )
    const expected = 'http://example.com/blog/?p=27'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.blogger.com/blog_this.pyra?t=&u=https%253A%252F%252Fexample.com%252Fpost&n=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.blogger.com/Blog-This.g?u=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapBloggerBlogThis(value)).toBe(expected)
  })

  it('should return undefined when the u param is missing', () => {
    const value = new URL('https://www.blogger.com/blog_this.pyra?t=&n=Hello')

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const value = new URL('https://www.blogger.com/blog-this.g?t=&u=&n=Hello')

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })

  it('should return undefined for a url in the quoted text', () => {
    const value = new URL(
      'https://www.blogger.com/blog-this.g?t=https%3A%2F%2Fexample.com%2Fpost&n=Hello',
    )

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })

  it('should return undefined for the embed form with a thumbnail', () => {
    const value = new URL(
      'https://www.blogger.com/blog-this.g?n=Boston+Public+Beach&source=youtube&b=%3Ciframe+src%3D%22https://www.example.com/embed/d9J14Q5C1LI%22%3E%3C/iframe%3E&eurl=https://i.example.com/vi/d9J14Q5C1LI/maxresdefault.jpg',
    )

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.blogger.com/go.g?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/blog-this.g?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBloggerBlogThis(value)).toBeUndefined()
  })
})
