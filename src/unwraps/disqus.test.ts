import { describe, expect, it } from 'bun:test'
import { unwrapDisqus } from './disqus.js'

describe('unwrapDisqus', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://disq.us/?url=https%3A%2F%2Fexample.com%2Fcomment&key=abc')

    expect(unwrapDisqus(url)).toBe('https://example.com/comment')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://disq.us/?key=abc')

    expect(unwrapDisqus(url)).toBeUndefined()
  })

  it('should return undefined for non-Disqus hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapDisqus(url)).toBeUndefined()
  })

  it('should extract target from the url path', () => {
    const url = new URL('https://disq.us/url?url=https%3A%2F%2Fexample.com%2Fpage&cuid=1064357')

    expect(unwrapDisqus(url)).toBe('https://example.com/page')
  })

  it('should drop the signature after the target', () => {
    const url = new URL(
      'https://disq.us/url?url=https%3A%2F%2Fexample.com%2F2026%2F06%2Fpost.html%3Aouxfjrpf22Z5p2zEB5xmkNm6Jx8&cuid=391019',
    )

    expect(unwrapDisqus(url)).toBe('https://example.com/2026/06/post.html')
  })

  it('should drop the signature after a target with no path', () => {
    const url = new URL(
      'https://disq.us/url?url=http%3A%2F%2Fwww.example.com%3A1Sm2KLu0-Xj6-7Bi6i9jvK0NUCI&cuid=1863462',
    )

    expect(unwrapDisqus(url)).toBe('http://www.example.com')
  })

  it('should keep the fragment of a signed target', () => {
    const url = new URL(
      'https://disq.us/url?url=http%3A%2F%2Fexample.com%2Fpost.html%23comment-4269334078%3AiZPy3bI0C8UCzWWZQKE2IXOI6WQ&forum=3451738',
    )

    expect(unwrapDisqus(url)).toBe('http://example.com/post.html#comment-4269334078')
  })

  it('should keep a colon inside the target path', () => {
    const url = new URL(
      'https://disq.us/url?url=https%3A%2F%2Fexample.com%2Fwiki%2FTalk%3AMain_Page',
    )

    expect(unwrapDisqus(url)).toBe('https://example.com/wiki/Talk:Main_Page')
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://disq.us/embed?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDisqus(url)).toBeUndefined()
  })
})
