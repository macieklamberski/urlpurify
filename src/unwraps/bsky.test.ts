import { describe, expect, it } from 'bun:test'
import { unwrapBlueskyRedirect } from './bsky.js'

describe('unwrapBlueskyRedirect', () => {
  it('should extract target from go.bsky.app', () => {
    const url = new URL('https://go.bsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBlueskyRedirect(url)).toBe('https://example.com/page')
  })

  it('should return undefined off the redirect path', () => {
    const url = new URL('https://go.bsky.app/other?u=https%3A%2F%2Fexample.com')

    expect(unwrapBlueskyRedirect(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://go.bsky.app/redirect')

    expect(unwrapBlueskyRedirect(url)).toBeUndefined()
  })

  it('should return undefined for non-Bluesky hosts', () => {
    const url = new URL('https://example.com/redirect?u=https%3A%2F%2Fother.com')

    expect(unwrapBlueskyRedirect(url)).toBeUndefined()
  })
})
