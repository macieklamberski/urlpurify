import { describe, expect, it } from 'bun:test'
import { unwrapStreamsend } from './streamsend.js'

describe('unwrapStreamsend', () => {
  it('should extract target from redirect_to param', () => {
    const value = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2Fseed-awards-about%2F',
    )
    const expected = 'https://example.org/seed-awards-about/'

    expect(unwrapStreamsend(value)).toBe(expected)
  })

  it('should extract target from a link with an unrendered hash placeholder', () => {
    const value = new URL(
      'http://app.streamsend.com/c/10009171/9311/{{{tracking_hash}}}/JTKY?redirect_to=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapStreamsend(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapStreamsend(value)).toBe(expected)
  })

  it('should return undefined when redirect_to param is missing', () => {
    const value = new URL('http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR')

    expect(unwrapStreamsend(value)).toBeUndefined()
  })

  it('should return undefined for a link with a non-numeric id', () => {
    const value = new URL(
      'http://app.streamsend.com/c/x28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(value)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const value = new URL(
      'http://app.streamsend.com/c/28063731/15939/SaaminY/qZQR/extra?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL(
      'http://app.streamsend.com/x/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'http://example.com/c/28063731/15939/SaaminY/qZQR?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapStreamsend(value)).toBeUndefined()
  })
})
