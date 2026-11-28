import { describe, expect, it } from 'bun:test'
import { unwrapYoutube } from './youtube.js'

describe('unwrapYoutube', () => {
  it('should extract target from q param', () => {
    const value = new URL(
      'https://www.youtube.com/redirect?event=video_description&redir_token=abc&q=https%3A%2F%2Fexample.com%2Fstory',
    )
    const expected = 'https://example.com/story'

    expect(unwrapYoutube(value)).toBe(expected)
  })

  it('should return undefined when q param is missing', () => {
    const value = new URL('https://www.youtube.com/redirect?event=video_description')

    expect(unwrapYoutube(value)).toBeUndefined()
  })

  it('should return undefined for non-redirect YouTube paths', () => {
    const value = new URL('https://www.youtube.com/watch?q=https%3A%2F%2Fexample.com')

    expect(unwrapYoutube(value)).toBeUndefined()
  })

  it('should return undefined for non-YouTube hosts', () => {
    const value = new URL('https://example.com/redirect?q=https%3A%2F%2Fother.com')

    expect(unwrapYoutube(value)).toBeUndefined()
  })
})
