import { describe, expect, it } from 'bun:test'
import {
  createParamExtractor,
  decodeBase64,
  decodeBase64Binary,
  decodeBase64Url,
  getUtf8ByteLength,
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

  it('should match the domain itself when given as domains', () => {
    const extract = createParamExtractor({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should match any subdomain of a domain given as domains', () => {
    const extract = createParamExtractor({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://a.b.example.com/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should match domains given as an array', () => {
    const extract = createParamExtractor({
      domains: ['example.com', 'example.net'],
      params: ['url'],
    })
    const value = new URL('https://redirect.example.net/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should return undefined for a host that only ends in a domain given as domains', () => {
    const extract = createParamExtractor({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://notexample.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for a host outside the domains', () => {
    const extract = createParamExtractor({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://example.net/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for an empty domain', () => {
    const extract = createParamExtractor({
      domains: '',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for an empty host', () => {
    const extract = createParamExtractor({
      hosts: '',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
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

  describe('twice-encoded target', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['url'],
    })

    it('should decode a twice-encoded http target', () => {
      const value = new URL('https://redirect.example.com/?url=http%253A%252F%252Fexample.com%252F')
      const expected = 'http://example.com/'

      expect(extract(value)).toBe(expected)
    })

    it('should decode a twice-encoded https target', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https%253A%252F%252Fexample.com%252Fpost%253Fid%253D1',
      )
      const expected = 'https://example.com/post?id=1'

      expect(extract(value)).toBe(expected)
    })

    it('should decode a twice-encoded scheme in uppercase', () => {
      const value = new URL(
        'https://redirect.example.com/?url=HTTPS%253A%252F%252Fexample.com%252F',
      )
      const expected = 'HTTPS://example.com/'

      expect(extract(value)).toBe(expected)
    })

    it('should decode a twice-encoded scheme with a lowercase colon escape', () => {
      const value = new URL('https://redirect.example.com/?url=http%253a%252f%252fexample.com%252f')
      const expected = 'http://example.com/'

      expect(extract(value)).toBe(expected)
    })

    it('should leave a target encoded once as it is', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https%3A%2F%2Fexample.com%2Fpost%253Fid%253D1',
      )
      const expected = 'https://example.com/post%3Fid%3D1'

      expect(extract(value)).toBe(expected)
    })

    it('should not decode a value that only holds an encoded scheme later on', () => {
      const value = new URL('https://redirect.example.com/?url=go-https%253A%252F%252Fexample.com')
      const expected = 'go-https%3A%2F%2Fexample.com'

      expect(extract(value)).toBe(expected)
    })

    it('should return the once-decoded value when the second decode throws', () => {
      const value = new URL('https://redirect.example.com/?url=https%253A%252F%252Fexample.com%25')
      const expected = 'https%3A%2F%2Fexample.com%'

      expect(extract(value)).toBe(expected)
    })
  })

  describe('plus in the target', () => {
    const extract = createParamExtractor({
      hosts: 'redirect.example.com',
      params: ['wgtarget'],
    })

    it('should keep a plus in the path and query of an unencoded target', () => {
      const value = new URL(
        'https://redirect.example.com/click.html?wgcampaignid=1647790&wgprogramid=294680&clickref=fitness&wgtarget=https://www.example.com/search/Freet+Tanga/?q=Freet+Tanga',
      )
      const expected = 'https://www.example.com/search/Freet+Tanga/?q=Freet+Tanga'

      expect(extract(value)).toBe(expected)
    })

    it('should keep a plus in an unencoded target with an uppercase scheme', () => {
      const value = new URL('https://redirect.example.com/?wgtarget=HTTPS://www.example.com/a+b')
      const expected = 'HTTPS://www.example.com/a+b'

      expect(extract(value)).toBe(expected)
    })

    it('should still decode percent escapes in an unencoded target', () => {
      const value = new URL(
        'https://redirect.example.com/?wgtarget=https://www.example.com/a+b/?q=%C3%A9t%C3%A9',
      )
      const expected = 'https://www.example.com/a+b/?q=été'

      expect(extract(value)).toBe(expected)
    })

    it('should read a plus in an encoded target as a space', () => {
      const value = new URL(
        'https://redirect.example.com/?wgtarget=https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3DFreet+Tanga',
      )
      const expected = 'https://www.example.com/search?q=Freet Tanga'

      expect(extract(value)).toBe(expected)
    })

    it('should read the first copy of the param', () => {
      const value = new URL(
        'https://redirect.example.com/?wgtarget=https://www.example.com/a+b&wgtarget=https://www.example.com/c',
      )
      const expected = 'https://www.example.com/a+b'

      expect(extract(value)).toBe(expected)
    })
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
