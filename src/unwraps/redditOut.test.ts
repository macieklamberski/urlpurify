import { describe, expect, it } from 'bun:test'
import { unwrapRedditOut } from './redditOut.js'

describe('unwrapRedditOut', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://out.reddit.com/?url=https%3A%2F%2Fexample.com%2Farticle&token=abc',
    )
    const expected = 'https://example.com/article'

    expect(unwrapRedditOut(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://out.reddit.com/?token=abc')

    expect(unwrapRedditOut(value)).toBeUndefined()
  })

  it('should return undefined for non-Reddit hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapRedditOut(value)).toBeUndefined()
  })

  it('should extract target from the post path', () => {
    const value = new URL(
      'https://out.reddit.com/t3_1abc2de?url=https%3A%2F%2Fexample.com%2Fpost&token=abc',
    )
    const expected = 'https://example.com/post'

    expect(unwrapRedditOut(value)).toBe(expected)
  })

  it('should return undefined for the submit share intent', () => {
    const value = new URL('https://www.reddit.com/submit?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditOut(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://out.reddit.com/about?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditOut(value)).toBeUndefined()
  })
})
