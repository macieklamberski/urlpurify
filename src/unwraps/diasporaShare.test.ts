import { describe, expect, it } from 'bun:test'
import { unwrapDiasporaShare } from './diasporaShare.js'

describe('unwrapDiasporaShare', () => {
  it('should extract a percent-encoded url', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/?url=https%3A%2F%2Fexample.com%2Fnachhaltigkeit-bene-und-min%2F&title=Nachhaltigkeit%3A%20BeNe%20und%20MIN',
    )
    const expected = 'https://example.com/nachhaltigkeit-bene-und-min/'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should extract a raw url', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/?url=https://example.com/post&title=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should extract a url from index.html', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/index.html?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should extract a url from index', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/index?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should extract a url from index with a trailing slash', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/index/?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/INDEX.HTML?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should extract url and ignore a url held in title', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/?title=https%3A%2F%2Fexample.org%2Fother&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapDiasporaShare(value)).toBe(expected)
  })

  it('should return undefined for a url held only in title', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/?title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapDiasporaShare(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://share.diasporafoundation.org/?url=&title=Hello')

    expect(unwrapDiasporaShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://share.diasporafoundation.org/about.html?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapDiasporaShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://blog.diasporafoundation.org/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapDiasporaShare(value)).toBeUndefined()
  })
})
