import { describe, expect, it } from 'bun:test'
import { unwrapWeiboShare } from './weiboShare.js'

describe('unwrapWeiboShare', () => {
  it('should extract a raw target from service.weibo.com', () => {
    const value = new URL(
      'http://service.weibo.com/share/share.php?url=https://example.com/feed/&appkey=&title=PildoLabs',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapWeiboShare(value)).toBe(expected)
  })

  it('should extract a percent-encoded target over its pic param', () => {
    const value = new URL(
      'https://service.weibo.com/share/share.php?url=https%3A%2F%2Fexample.com%2Fnew-blog-f1pace-com%2F&title=New+site%3A+F1pace.com&pic=https://example.org/storage/2022/04/f1pace_com.png',
    )
    const expected = 'https://example.com/new-blog-f1pace-com/'

    expect(unwrapWeiboShare(value)).toBe(expected)
  })

  it('should extract the target from v.t.sina.com.cn', () => {
    const value = new URL(
      'http://v.t.sina.com.cn/share/share.php?title=&url=http://www.example.com/webobj/NewPost/ShowPost.asp?id_no=33126&postClass=(1,2,3)',
    )
    const expected = 'http://www.example.com/webobj/NewPost/ShowPost.asp?id_no=33126'

    expect(unwrapWeiboShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://service.weibo.com/share/share.php?url=https%253A%252F%252Fexample.com%252Fpost&title=Post',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWeiboShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://service.weibo.com/Share/Share.php?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWeiboShare(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://service.weibo.com/share/share.php?url=&title=Post')

    expect(unwrapWeiboShare(value)).toBeUndefined()
  })

  it('should return undefined for a pic param without a url param', () => {
    const value = new URL(
      'https://service.weibo.com/share/share.php?title=Post&pic=https%3A%2F%2Fexample.com%2Fimage.png',
    )

    expect(unwrapWeiboShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://service.weibo.com/share/button.php?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapWeiboShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/share/share.php?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapWeiboShare(value)).toBeUndefined()
  })
})
