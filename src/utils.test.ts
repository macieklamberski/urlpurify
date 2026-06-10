import { describe, expect, it } from 'bun:test'
import {
  createParamExtractor,
  decodeBase64,
  decodeBase64Binary,
  decodeBase64Url,
  getUtf8ByteLength,
  isHostOf,
  isSubdomainOf,
} from './utils.js'

const exampleSubdomainRegex = /\.example\.com$/

describe('createParamExtractor', () => {
  it('should extract the first present param for a matching host', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url', 'target'],
    })
    const value = new URL('https://redirect.example.com/?target=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should prefer the first listed param when several are present', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url', 'target'],
    })
    const value = new URL(
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fsecond&url=https%3A%2F%2Fexample.com%2Ffirst',
    )
    const expected = 'https://example.com/first'

    expect(extract(value)).toBe(expected)
  })

  it('should match hosts given as an array', () => {
    const extract = createParamExtractor({
      hosts: ['a.example.com', 'b.example.com'],
      params: ['url'],
    })
    const value = new URL('https://b.example.com/?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should match hosts given as a regex', () => {
    const extract = createParamExtractor({
      hosts: exampleSubdomainRegex,
      params: ['url'],
    })
    const value = new URL('https://sub.example.com/?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should require the configured path when given', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/out?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should return undefined for a non-matching path', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/in?url=https%3A%2F%2Fexample.com')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for non-matching hosts', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.com')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined when the param is missing', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/?other=value')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined when the param is empty', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/?url=')

    expect(extract(value)).toBeUndefined()
  })
})

describe('isHostOf', () => {
  it('should match the exact hostname for a string input', () => {
    expect(isHostOf('https://example.com/path', 'example.com')).toBe(true)
  })

  it('should match the exact hostname for a URL instance', () => {
    const value = new URL('https://example.com/path')

    expect(isHostOf(value, 'example.com')).toBe(true)
  })

  it('should not match a different hostname for a URL instance', () => {
    const value = new URL('https://sub.example.com/path')

    expect(isHostOf(value, 'example.com')).toBe(false)
  })

  it('should match hostnames case-insensitively', () => {
    expect(isHostOf('https://EXAMPLE.com/path', 'example.com')).toBe(true)
  })

  it('should match host patterns case-insensitively', () => {
    expect(isHostOf('https://example.com/path', 'EXAMPLE.com')).toBe(true)
  })

  it('should match hosts given as an array', () => {
    expect(isHostOf('https://example.com/path', ['other.com', 'example.com'])).toBe(true)
  })

  it('should not match subdomains', () => {
    expect(isHostOf('https://sub.example.com/path', 'example.com')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isHostOf('not a url', 'example.com')).toBe(false)
  })
})

describe('isSubdomainOf', () => {
  it('should match subdomains for a string input', () => {
    expect(isSubdomainOf('https://sub.example.com/path', 'example.com')).toBe(true)
  })

  it('should match subdomains for a URL instance', () => {
    const value = new URL('https://sub.example.com/path')

    expect(isSubdomainOf(value, 'example.com')).toBe(true)
  })

  it('should not match the bare domain for a URL instance', () => {
    const value = new URL('https://example.com/path')

    expect(isSubdomainOf(value, 'example.com')).toBe(false)
  })

  it('should match domains given as an array', () => {
    expect(isSubdomainOf('https://sub.example.com/path', ['other.com', 'example.com'])).toBe(true)
  })

  it('should not match the bare domain', () => {
    expect(isSubdomainOf('https://example.com/path', 'example.com')).toBe(false)
  })

  it('should not match a different domain sharing a suffix', () => {
    expect(isSubdomainOf('https://notexample.com/path', 'example.com')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isSubdomainOf('not a url', 'example.com')).toBe(false)
  })
})

describe('decodeBase64Binary', () => {
  it('should decode base64 into a binary string', () => {
    const value = 'aGVsbG8='
    const expected = 'hello'

    expect(decodeBase64Binary(value)).toBe(expected)
  })

  it('should decode unpadded base64', () => {
    const value = 'aGVsbG8'
    const expected = 'hello'

    expect(decodeBase64Binary(value)).toBe(expected)
  })

  it('should return undefined for invalid base64', () => {
    expect(decodeBase64Binary('!!!')).toBeUndefined()
  })
})

describe('decodeBase64', () => {
  it('should decode base64 into a UTF-8 string', () => {
    const value = 'xKnFvsO4'
    const expected = 'ĩžø'

    expect(decodeBase64(value)).toBe(expected)
  })

  it('should decode ASCII content', () => {
    const value = 'aHR0cHM6Ly9leGFtcGxlLmNvbQ=='
    const expected = 'https://example.com'

    expect(decodeBase64(value)).toBe(expected)
  })

  it('should return undefined for invalid base64', () => {
    expect(decodeBase64('!!!')).toBeUndefined()
  })
})

describe('decodeBase64Url', () => {
  it('should decode base64url with url-safe characters', () => {
    const value = 'Pz8-Pw'
    const expected = '??>?'

    expect(decodeBase64Url(value)).toBe(expected)
  })

  it('should decode underscores as slashes', () => {
    const value = 'aHR0cHM6Ly9leGFtcGxlLmNvbS9hL2I_cT0x'
    const expected = 'https://example.com/a/b?q=1'

    expect(decodeBase64Url(value)).toBe(expected)
  })

  it('should return undefined for invalid input', () => {
    expect(decodeBase64Url('!!!')).toBeUndefined()
  })
})

describe('getUtf8ByteLength', () => {
  it('should count ASCII characters as one byte', () => {
    const value = 'hello'

    expect(getUtf8ByteLength(value)).toBe(5)
  })

  it('should count multi-byte characters by their UTF-8 size', () => {
    expect(getUtf8ByteLength('ã')).toBe(2)
    expect(getUtf8ByteLength('€')).toBe(3)
  })

  it('should return zero for empty strings', () => {
    expect(getUtf8ByteLength('')).toBe(0)
  })
})
