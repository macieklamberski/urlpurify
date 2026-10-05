import { describe, expect, it } from 'bun:test'
import { unwrapSkimlinks } from './skimlinks.js'

describe('unwrapSkimlinks', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://go.skimresources.com/?id=12345&xs=1&url=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapSkimlinks(url)).toBe('https://example.com/product')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://go.skimresources.com/?id=12345&xs=1')

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should return undefined for non-Skimlinks hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://go.skimresources.com/redirect?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSkimlinks(url)).toBeUndefined()
  })
})
