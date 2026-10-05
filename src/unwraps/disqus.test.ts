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

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://disq.us/embed?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDisqus(url)).toBeUndefined()
  })
})
