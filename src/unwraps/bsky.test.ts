import { describe, expect, it } from 'bun:test'
import { unwrapBsky } from './bsky.js'

describe('unwrapBsky', () => {
  it('should extract target from go.bsky.app', () => {
    const value = new URL('https://go.bsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapBsky(value)).toBe(expected)
  })

  it('should return undefined off the redirect path', () => {
    const value = new URL('https://go.bsky.app/other?u=https%3A%2F%2Fexample.com')

    expect(unwrapBsky(value)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://go.bsky.app/redirect')

    expect(unwrapBsky(value)).toBeUndefined()
  })

  it('should return undefined for non-Bluesky hosts', () => {
    const value = new URL('https://example.com/redirect?u=https%3A%2F%2Fother.com')

    expect(unwrapBsky(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplebsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(value)).toBeUndefined()
  })

  it('should return undefined for the compose intent', () => {
    const value = new URL('https://bsky.app/intent/compose?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(value)).toBeUndefined()
  })

  it('should return undefined for bsky.app, a host that does not run the redirect', () => {
    const value = new URL('https://bsky.app/redirect?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBsky(value)).toBeUndefined()
  })
})
