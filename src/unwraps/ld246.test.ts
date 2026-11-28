import { describe, expect, it } from 'bun:test'
import { unwrapLd246 } from './ld246.js'

describe('unwrapLd246', () => {
  it('should extract target from goto param', () => {
    const value = new URL('https://ld246.com/forward?goto=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrapLd246(value)).toBe(expected)
  })

  it('should return undefined when goto param is missing', () => {
    const value = new URL('https://ld246.com/forward?other=value')

    expect(unwrapLd246(value)).toBeUndefined()
  })

  it('should return undefined when goto param is empty', () => {
    const value = new URL('https://ld246.com/forward?goto=')

    expect(unwrapLd246(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://ld246.com/article/1?goto=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLd246(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('https://www.example.com/forward?goto=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLd246(value)).toBeUndefined()
  })
})
