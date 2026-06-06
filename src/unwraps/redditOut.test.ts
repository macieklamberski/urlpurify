import { describe, expect, it } from 'bun:test'
import { unwrapRedditOut } from './redditOut.js'

describe('unwrapRedditOut', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://out.reddit.com/?url=https%3A%2F%2Fexample.com%2Farticle&token=abc')

    expect(unwrapRedditOut(url)).toBe('https://example.com/article')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://out.reddit.com/?token=abc')

    expect(unwrapRedditOut(url)).toBeUndefined()
  })

  it('should return undefined for non-Reddit hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapRedditOut(url)).toBeUndefined()
  })
})
