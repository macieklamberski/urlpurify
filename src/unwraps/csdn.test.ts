import { describe, expect, it } from 'bun:test'
import { unwrapCsdn } from './csdn.js'

describe('unwrapCsdn', () => {
  it('should extract target from target param', () => {
    const value = new URL('https://link.csdn.net/?target=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapCsdn(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('https://link.csdn.net/?target=https://example.com/corporate-information')
    const expected = 'https://example.com/corporate-information'

    expect(unwrapCsdn(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://link.csdn.net/?other=value')

    expect(unwrapCsdn(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://link.csdn.net/link.php?target=https%3A%2F%2Fexample.com%2F')

    expect(unwrapCsdn(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/?target=https%3A%2F%2Fexample.org%2F')

    expect(unwrapCsdn(value)).toBeUndefined()
  })
})
