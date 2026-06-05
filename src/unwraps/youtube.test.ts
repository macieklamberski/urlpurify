import { describe, expect, it } from 'bun:test'
import { unwrapYouTube } from './youtube.js'

describe('unwrapYouTube', () => {
  it('should extract target from q param', () => {
    const url = new URL(
      'https://www.youtube.com/redirect?event=video_description&redir_token=abc&q=https%3A%2F%2Fexample.com%2Fstory',
    )

    expect(unwrapYouTube(url)).toBe('https://example.com/story')
  })

  it('should return undefined when q param is missing', () => {
    const url = new URL('https://www.youtube.com/redirect?event=video_description')

    expect(unwrapYouTube(url)).toBeUndefined()
  })

  it('should return undefined for non-redirect YouTube paths', () => {
    const url = new URL('https://www.youtube.com/watch?q=https%3A%2F%2Fexample.com')

    expect(unwrapYouTube(url)).toBeUndefined()
  })

  it('should return undefined for non-YouTube hosts', () => {
    const url = new URL('https://example.com/redirect?q=https%3A%2F%2Fother.com')

    expect(unwrapYouTube(url)).toBeUndefined()
  })
})
