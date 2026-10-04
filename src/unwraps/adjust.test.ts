import { describe, expect, it } from 'bun:test'
import { unwrapAdjust } from './adjust.js'

describe('unwrapAdjust', () => {
  it('should extract target from redirect param', () => {
    const url = new URL(
      'https://app.adjust.com/abc123?campaign=launch&redirect=https%3A%2F%2Fexample.com%2Fapp',
    )

    expect(unwrapAdjust(url)).toBe('https://example.com/app')
  })

  it('should return undefined when redirect param is missing', () => {
    const url = new URL('https://app.adjust.com/abc123?campaign=launch')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for non-Adjust hosts', () => {
    const url = new URL('https://example.com/abc123?redirect=https%3A%2F%2Fother.com')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined when redirect is a custom-scheme URI', () => {
    const url = new URL('https://app.adjust.com/abc123?redirect=myapp%3A%2F%2Fopen')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should extract target from adjust.io, a subdomain no specimen shows', () => {
    const url = new URL('https://app.eu.adjust.io/abc123?redirect=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAdjust(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a sibling path below the token', () => {
    const url = new URL(
      'https://app.adjust.com/abc123/extra?redirect=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const url = new URL('https://www.adjust.com/?redirect=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAdjust(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampleadjust.com/abc123?redirect=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAdjust(url)).toBeUndefined()
  })
})
