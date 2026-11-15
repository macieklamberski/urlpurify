import { describe, expect, it } from 'bun:test'
import { unwrapHackerNewsSubmit } from './hackerNewsSubmit.js'

describe('unwrapHackerNewsSubmit', () => {
  it('should extract a raw url', () => {
    const value = new URL(
      'https://news.ycombinator.com/submitlink?u=https://example.com/strategy/2026/06/22/riding-technology-waves.html&t=Riding%20Technology%20Waves',
    )
    const expected = 'https://example.com/strategy/2026/06/22/riding-technology-waves.html'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should extract a percent-encoded url', () => {
    const value = new URL(
      'https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fexample.com%2Fclaude-code-ruin&t=Will%20Claude%20Code%20ruin%20our%20team%3F',
    )
    const expected = 'https://example.com/claude-code-ruin'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should extract a url encoded in lowercase hex', () => {
    const value = new URL(
      'https://news.ycombinator.com/submitlink?u=https%3a%2f%2fexample.com%2fposts%2fjujutsu-shortest-ids%2f&t=Why%20are%20Jujutsu%27s%20ID%20Prefixes%20So%20Short%3f',
    )
    const expected = 'https://example.com/posts/jujutsu-shortest-ids/'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should extract a url placed after the title', () => {
    const value = new URL(
      'https://news.ycombinator.com/submitlink?t=A%20guide%20to%20sensible%20composition%20in%20SwiftUI&u=https%3A%2F%2Fexample.com%2Fblog%2Fa-guide-for-sensible-composition-in-swiftui%3Fref%3Dssnews_blog',
    )
    const expected =
      'https://example.com/blog/a-guide-for-sensible-composition-in-swiftui?ref=ssnews_blog'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should cut a raw url at the title param', () => {
    const value = new URL(
      'http://news.ycombinator.com/submitlink?u=https://example.ca/?p=1522&t=IMG_20150216_155437',
    )
    const expected = 'https://example.ca/?p=1522'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://news.ycombinator.com/SubmitLink?u=https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://news.ycombinator.com/submitlink?u=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapHackerNewsSubmit(value)).toBe(expected)
  })

  it('should return undefined for a link with only a title', () => {
    const value = new URL('https://news.ycombinator.com/submitlink?t=https://example.com/post')

    expect(unwrapHackerNewsSubmit(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://news.ycombinator.com/submitlink?u=&t=Hello')

    expect(unwrapHackerNewsSubmit(value)).toBeUndefined()
  })

  it('should return undefined for a url on another path', () => {
    const value = new URL('https://news.ycombinator.com/item?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapHackerNewsSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.ycombinator.com/submitlink?u=https://example.com/post')

    expect(unwrapHackerNewsSubmit(value)).toBeUndefined()
  })
})
