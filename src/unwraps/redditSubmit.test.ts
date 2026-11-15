import { describe, expect, it } from 'bun:test'
import { unwrapRedditSubmit } from './redditSubmit.js'

describe('unwrapRedditSubmit', () => {
  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://reddit.com/submit?url=https%3A%2F%2Fexample.com%2Finstalling-and-using-git-and-github-ubuntu-beginners-guide&title=Installing%20and%20using%20Git%20a',
    )
    const expected =
      'https://example.com/installing-and-using-git-and-github-ubuntu-beginners-guide'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should extract the target on www.reddit.com', () => {
    const value = new URL(
      'https://www.reddit.com/submit?url=https%3A%2F%2Fexample.com%2F2024%2F05%2Fpost%2F',
    )
    const expected = 'https://example.com/2024/05/post/'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should extract a raw target on en.reddit.com', () => {
    const value = new URL(
      'http://en.reddit.com/submit?url=http://example.com/?p=2191&title=Psychedelic',
    )
    const expected = 'http://example.com/?p=2191'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should extract the target from /submit/ with a trailing slash', () => {
    const value = new URL(
      'https://reddit.com/submit/?url=https%3a%2f%2fexample.com%2fethics-of-war-ukraine-russia-1%2f&resubmit=true&title=The%20Ukraine%20Conflict',
    )
    const expected = 'https://example.com/ethics-of-war-ukraine-russia-1/'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should extract the target when title comes first', () => {
    const value = new URL(
      'https://www.reddit.com/submit?title=Hello%20World&url=https%3A%2F%2Fexample.com%2Fhello-world',
    )
    const expected = 'https://example.com/hello-world'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.reddit.com/submit?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.reddit.com/Submit?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapRedditSubmit(value)).toBe(expected)
  })

  it('should return undefined when only a title is given', () => {
    const value = new URL('https://www.reddit.com/submit?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditSubmit(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.reddit.com/submit?url=&title=Hello')

    expect(unwrapRedditSubmit(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.reddit.com/media?url=https%3A%2F%2Fexample.com%2Fphoto.jpg')

    expect(unwrapRedditSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the outbound tracker', () => {
    const value = new URL('https://out.reddit.com/t3_br0rjs?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRedditSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/submit?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapRedditSubmit(value)).toBeUndefined()
  })
})
