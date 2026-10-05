import { describe, expect, it } from 'bun:test'
import { unwrapLd246 } from './ld246.js'

describe('unwrapLd246', () => {
  it('should extract target from goto param', () => {
    const url = new URL('https://ld246.com/forward?goto=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLd246(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when goto param is missing', () => {
    const url = new URL('https://ld246.com/forward?other=value')

    expect(unwrapLd246(url)).toBeUndefined()
  })

  it('should return undefined when goto param is empty', () => {
    const url = new URL('https://ld246.com/forward?goto=')

    expect(unwrapLd246(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://ld246.com/article/1?goto=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLd246(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://www.example.com/forward?goto=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLd246(url)).toBeUndefined()
  })
})
