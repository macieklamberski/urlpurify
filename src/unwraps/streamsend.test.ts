import { describe, expect, it } from 'bun:test'
import { unwrapStreamsend } from './streamsend.js'

describe('unwrapStreamsend', () => {
  it('should extract target from redirect_to param', () => {
    const url = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2Fseed-awards-about%2F',
    )

    expect(unwrapStreamsend(url)).toBe('https://example.org/seed-awards-about/')
  })

  it('should extract target from a link with an unrendered hash placeholder', () => {
    const url = new URL(
      'http://app.streamsend.com/c/10009171/9311/{{{tracking_hash}}}/JTKY?redirect_to=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStreamsend(url)).toBe('http://www.example.com/')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%253A%252F%252Fexample.org%252Fpage',
    )

    expect(unwrapStreamsend(url)).toBe('https://example.org/page')
  })

  it('should return undefined when redirect_to param is missing', () => {
    const url = new URL('http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR')

    expect(unwrapStreamsend(url)).toBeUndefined()
  })

  it('should return undefined for a link with a non-numeric id', () => {
    const url = new URL(
      'http://app.streamsend.com/c/x28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(url)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const url = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR/extra?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(url)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const url = new URL(
      'http://app.streamsend.com/x/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'http://example.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(url)).toBeUndefined()
  })
})
