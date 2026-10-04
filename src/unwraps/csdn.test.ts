import { describe, expect, it } from 'bun:test'
import { unwrapCsdn } from './csdn.js'

describe('unwrapCsdn', () => {
  it('should extract target from target param', () => {
    const url = new URL('https://link.csdn.net/?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapCsdn(url)).toBe('https://example.com/page')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://link.csdn.net/?target=https://example.com/corporate-information')

    expect(unwrapCsdn(url)).toBe('https://example.com/corporate-information')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://link.csdn.net/?other=value')

    expect(unwrapCsdn(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://link.csdn.net/link.php?target=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCsdn(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another CSDN host', () => {
    const url = new URL('https://blog.csdn.net/?target=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCsdn(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/?target=https%3A%2F%2Fexample.org%2F')

    expect(unwrapCsdn(url)).toBeUndefined()
  })
})
