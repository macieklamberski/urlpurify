import { describe, expect, it } from 'bun:test'
import { unwrapThreadsIntent } from './threadsIntent.js'

describe('unwrapThreadsIntent', () => {
  it('should extract a percent-encoded url after text', () => {
    const value = new URL(
      'https://threads.net/intent/post?text=Tom%20Colicchio%26%238217%3Bs%20Final%20Service&url=https%3A%2F%2Fexample.com%2F2026%2F06%2Ftom-colicchios-final-service%2F',
    )
    const expected = 'https://example.com/2026/06/tom-colicchios-final-service/'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should extract a percent-encoded url before text', () => {
    const value = new URL(
      'https://www.threads.net/intent/post?url=https%3A%2F%2Fwww.example.org%2Fsummer-garden-story-time-zinnias%2F&text=Summer%20Garden%20Story%20Time%3A%20Planting%20Zinnias',
    )
    const expected = 'https://www.example.org/summer-garden-story-time-zinnias/'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should extract a raw url', () => {
    const value = new URL(
      'https://www.threads.net/intent/post?url=https://example.com/articles/10347709',
    )
    const expected = 'https://example.com/articles/10347709'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should extract a url from threads.com', () => {
    const value = new URL(
      'https://www.threads.com/intent/post?url=https%3A%2F%2Fexample.com%2Fpost&text=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should extract a url from a path with a trailing slash', () => {
    const value = new URL(
      'https://www.threads.com/intent/post/?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.threads.net/Intent/Post?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://www.threads.net/intent/post?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should extract url and ignore a url held in text', () => {
    const value = new URL(
      'https://www.threads.net/intent/post?text=https%3A%2F%2Fexample.org%2Fother&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapThreadsIntent(value)).toBe(expected)
  })

  it('should return undefined for a url held only in text', () => {
    const value = new URL('https://www.threads.net/intent/post?text=https://example.com/post')

    expect(unwrapThreadsIntent(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://www.threads.net/intent/post?url=&text=Hello')

    expect(unwrapThreadsIntent(value)).toBeUndefined()
  })

  it('should return undefined for a url on another path', () => {
    const value = new URL(
      'https://www.threads.net/intent/follow?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapThreadsIntent(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/intent/post?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapThreadsIntent(value)).toBeUndefined()
  })
})
