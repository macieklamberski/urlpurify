import { describe, expect, it } from 'bun:test'
import { unwrapSkimlinks } from './skimlinks.js'

describe('unwrapSkimlinks', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://go.skimresources.com/?id=12345&xs=1&url=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapSkimlinks(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://go.skimresources.com/?id=12345&xs=1')

    expect(unwrapSkimlinks(value)).toBeUndefined()
  })

  it('should return undefined for non-Skimlinks hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapSkimlinks(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://go.skimresources.com/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSkimlinks(value)).toBeUndefined()
  })
})
