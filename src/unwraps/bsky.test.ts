import { describe, expect, it } from 'bun:test'
import { unwrapBsky } from './bsky.js'

describe('unwrapBsky', () => {
  it('should extract target from go.bsky.app', () => {
    const url = new URL('https://go.bsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(url)).toBe('https://example.com/page')
  })

  it('should return undefined off the redirect path', () => {
    const url = new URL('https://go.bsky.app/other?u=https%3A%2F%2Fexample.com')

    expect(unwrapBsky(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://go.bsky.app/redirect')

    expect(unwrapBsky(url)).toBeUndefined()
  })

  it('should return undefined for non-Bluesky hosts', () => {
    const url = new URL('https://example.com/redirect?u=https%3A%2F%2Fother.com')

    expect(unwrapBsky(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplebsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(url)).toBeUndefined()
  })

  it('should return undefined for the compose intent', () => {
    const url = new URL('https://bsky.app/intent/compose?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(url)).toBeUndefined()
  })

  it('should return undefined for bsky.app, a host that does not run the redirect', () => {
    const url = new URL('https://bsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(url)).toBeUndefined()
  })
})
