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
    const url = new URL('https://redirect.example.com/?target=https%3A%2F%2Fexample.com')

    expect(extract(url)).toBe('https://example.com')
  })

  it('should match hosts given as an array', () => {
    const extract = createParamExtractor({
      hosts: ['a.example.com', 'b.example.com'],
      params: ['url'],
    })
    const url = new URL('https://b.example.com/?url=https%3A%2F%2Fexample.com')

    expect(extract(url)).toBe('https://example.com')
  })

  it('should match hosts given as a regex', () => {
    const extract = createParamExtractor({
      hosts: exampleSubdomainRegex,
      params: ['url'],
    })
    const url = new URL('https://sub.example.com/?url=https%3A%2F%2Fexample.com')

    expect(extract(url)).toBe('https://example.com')
  })

  it('should require the configured path when given', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const matching = new URL('https://redirect.example.com/out?url=https%3A%2F%2Fexample.com')
    const nonMatching = new URL('https://redirect.example.com/in?url=https%3A%2F%2Fexample.com')

    expect(extract(matching)).toBe('https://example.com')
    expect(extract(nonMatching)).toBeUndefined()
  })

  it('should return undefined for non-matching hosts', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const url = new URL('https://example.com/?url=https%3A%2F%2Fexample.com')

    expect(extract(url)).toBeUndefined()
  })
})

describe('isHostOf', () => {
  it('should match the exact hostname', () => {
    expect(isHostOf('https://example.com/path', 'example.com')).toBe(true)
  })

  it('should match hostnames case-insensitively', () => {
    expect(isHostOf('https://EXAMPLE.com/path', 'example.com')).toBe(true)
  })

  it('should not match subdomains', () => {
    expect(isHostOf('https://sub.example.com/path', 'example.com')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isHostOf('not a url', 'example.com')).toBe(false)
  })
})

describe('isSubdomainOf', () => {
  it('should match subdomains', () => {
    expect(isSubdomainOf('https://sub.example.com/path', 'example.com')).toBe(true)
  })

  it('should not match the bare domain', () => {
    expect(isSubdomainOf('https://example.com/path', 'example.com')).toBe(false)
  })

  it('should return false for invalid URLs', () => {
    expect(isSubdomainOf('not a url', 'example.com')).toBe(false)
  })
})

describe('decodeBase64Binary', () => {
  it('should decode base64 into a binary string', () => {
    expect(decodeBase64Binary('aGVsbG8=')).toBe('hello')
  })

  it('should decode unpadded base64', () => {
    expect(decodeBase64Binary('aGVsbG8')).toBe('hello')
  })

  it('should return undefined for invalid base64', () => {
    expect(decodeBase64Binary('!!!')).toBeUndefined()
  })
})

describe('decodeBase64', () => {
  it('should decode base64 into a UTF-8 string', () => {
    expect(decodeBase64('xKnFvsO4')).toBe('ĩžø')
  })

  it('should return undefined for invalid base64', () => {
    expect(decodeBase64('!!!')).toBeUndefined()
  })
})

describe('decodeBase64Url', () => {
  it('should decode base64url with url-safe characters', () => {
    expect(decodeBase64Url('Pz8-Pw')).toBe('??>?')
  })

  it('should return undefined for invalid input', () => {
    expect(decodeBase64Url('!!!')).toBeUndefined()
  })
})

describe('getUtf8ByteLength', () => {
  it('should count ASCII characters as one byte', () => {
    expect(getUtf8ByteLength('hello')).toBe(5)
  })

  it('should count multi-byte characters by their UTF-8 size', () => {
    expect(getUtf8ByteLength('ã')).toBe(2)
    expect(getUtf8ByteLength('€')).toBe(3)
  })
})
