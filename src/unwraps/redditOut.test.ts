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

  it('should extract target from the post path', () => {
    const url = new URL(
      'https://out.reddit.com/t3_1abc2de?url=https%3A%2F%2Fexample.com%2Fpost&token=abc',
    )

    expect(unwrapRedditOut(url)).toBe('https://example.com/post')
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://out2.reddit.com/t3_1abc2de?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditOut(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplereddit.com/t3_1abc2de?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditOut(url)).toBeUndefined()
  })

  it('should return undefined for the submit share intent', () => {
    const url = new URL('https://www.reddit.com/submit?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditOut(url)).toBeUndefined()
  })
})
