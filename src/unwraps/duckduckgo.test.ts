import { describe, expect, it } from 'bun:test'
import { unwrapDuckduckgo } from './duckduckgo.js'

describe('unwrapDuckduckgo', () => {
  it('should extract target from uddg param', () => {
    const url = new URL('https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapDuckduckgo(url)).toBe('https://example.com/page')
  })

  it('should return undefined when uddg param is missing', () => {
    const url = new URL('https://duckduckgo.com/l/?other=value')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for paths other than /l/', () => {
    const url = new URL('https://duckduckgo.com/?uddg=https%3A%2F%2Fexample.com')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for the ad click', () => {
    const url = new URL('https://duckduckgo.com/y.js?u3=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for the u param on the /k/ path', () => {
    const url = new URL('https://duckduckgo.com/k/?u=http%3A%2F%2Fwww.example.com%2Fbook.pdf')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })

  it('should return undefined for non-DuckDuckGo hosts', () => {
    const url = new URL('https://example.com/l/?uddg=https%3A%2F%2Fother.com')

    expect(unwrapDuckduckgo(url)).toBeUndefined()
  })
})
