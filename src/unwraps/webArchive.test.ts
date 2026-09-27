import { describe, expect, it } from 'bun:test'
import { unwrapWebArchive } from './webArchive.js'

describe('unwrapWebArchive', () => {
  it('should extract original URL from snapshot path', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000/https%3A%2F%2Fexample.com%2Farticle',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/article')
  })

  it('should keep the query string and fragment of an unencoded target', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000/https://example.com/a?id=5#section',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/a?id=5#section')
  })

  it('should accept the wildcard suffix on the timestamp', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000*/https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/page')
  })

  it('should return undefined when timestamp has wrong digit count', () => {
    const url = new URL('https://web.archive.org/web/2024/https%3A%2F%2Fexample.com')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for non-archive.org hosts', () => {
    const url = new URL('https://example.com/web/20240101120000/https%3A%2F%2Fother.com')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined when encoded URL has malformed percent escapes', () => {
    const url = new URL('https://web.archive.org/web/20240101120000/bad%ZZ')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })
})
