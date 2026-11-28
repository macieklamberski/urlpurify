import { describe, expect, it } from 'bun:test'
import { unwrapDuckduckgo } from './duckduckgo.js'

describe('unwrapDuckduckgo', () => {
  it('should extract target from uddg param', () => {
    const value = new URL('https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapDuckduckgo(value)).toBe(expected)
  })

  it('should return undefined when uddg param is missing', () => {
    const value = new URL('https://duckduckgo.com/l/?other=value')

    expect(unwrapDuckduckgo(value)).toBeUndefined()
  })

  it('should return undefined for paths other than /l/', () => {
    const value = new URL('https://duckduckgo.com/?uddg=https%3A%2F%2Fexample.com')

    expect(unwrapDuckduckgo(value)).toBeUndefined()
  })

  it('should return undefined for the ad click', () => {
    const value = new URL('https://duckduckgo.com/y.js?u3=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapDuckduckgo(value)).toBeUndefined()
  })

  it('should return undefined for the u param on the /k/ path', () => {
    const value = new URL('https://duckduckgo.com/k/?u=http%3A%2F%2Fwww.example.com%2Fbook.pdf')

    expect(unwrapDuckduckgo(value)).toBeUndefined()
  })

  it('should return undefined for non-DuckDuckGo hosts', () => {
    const value = new URL('https://example.com/l/?uddg=https%3A%2F%2Fother.com')

    expect(unwrapDuckduckgo(value)).toBeUndefined()
  })
})
