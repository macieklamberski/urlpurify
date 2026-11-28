import { describe, expect, it } from 'bun:test'
import { decodeBase64, getQueryParam } from 'trousse'
import type { UrlUnwrapper } from './types.js'
import {
  createQueryUnwrapper,
  createUnwrapper,
  getBrandLabels,
  getUtf8ByteLength,
  readDecodedTarget,
  readParamTarget,
  unwrapperHosts,
} from './utils.js'

const exampleSubdomainRegex = /\.example\.com$/
const clickPathRegex = /^\/click\/\d+$/
const clickHostRegex = /^click\d+\.example\.com$/
const lowercasePathRegex = /^\/[a-z]+$/

describe('createQueryUnwrapper', () => {
  it('should keep a raw plus in an encoded target with plus set to keep', () => {
    const extract = createQueryUnwrapper({
      hosts: 'images.example.com',
      params: ['url'],
      plus: 'keep',
    })
    const value = new URL('https://images.example.com/?url=https%3A%2F%2Fexample.com%2FC++.png')
    const expected = 'https://example.com/C++.png'

    expect(extract(value)).toBe(expected)
  })

  it('should extract the first present param for a matching host', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url', 'target'],
    })
    const value = new URL('https://redirect.example.com/?target=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should prefer the first listed param when several are present', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url', 'target'],
    })
    const value = new URL(
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.com%2Fsecond&url=https%3A%2F%2Fexample.com%2Ffirst',
    )
    const expected = 'https://example.com/first'

    expect(extract(value)).toBe(expected)
  })

  describe('scheme of the value', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url', 'fallback'],
    })

    it('should skip a value in an app scheme for the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=myapp://open&fallback=https://example.com/app',
      )
      const expected = 'https://example.com/app'

      expect(extract(value)).toBe(expected)
    })

    it('should skip a mailto value for the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=mailto:jobs@example.com&fallback=https://example.com/app',
      )
      const expected = 'https://example.com/app'

      expect(extract(value)).toBe(expected)
    })

    it('should skip a relative path for the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=/local/page&fallback=https://example.com/app',
      )
      const expected = 'https://example.com/app'

      expect(extract(value)).toBe(expected)
    })

    it('should skip a title for the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=Example+News+Today&fallback=https://example.com/app',
      )
      const expected = 'https://example.com/app'

      expect(extract(value)).toBe(expected)
    })

    it('should return a value without a scheme over the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=www.example.com/page&fallback=https://example.com/app',
      )
      const expected = 'www.example.com/page'

      expect(extract(value)).toBe(expected)
    })

    it('should return a host with a port over the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=www.example.com:8080/page&fallback=https://example.com/app',
      )
      const expected = 'www.example.com:8080/page'

      expect(extract(value)).toBe(expected)
    })

    it('should return a feed scheme value over the next param', () => {
      const value = new URL(
        'https://redirect.example.com/?url=feed:https://example.com/feed&fallback=https://example.com/app',
      )
      const expected = 'feed:https://example.com/feed'

      expect(extract(value)).toBe(expected)
    })

    it('should return undefined when every value is in an app scheme', () => {
      const value = new URL('https://redirect.example.com/?url=myapp://open&fallback=myapp://home')

      expect(extract(value)).toBeUndefined()
    })
  })

  it('should match hosts given as an array', () => {
    const extract = createQueryUnwrapper({
      hosts: ['a.example.com', 'b.example.com'],
      params: ['url'],
    })
    const value = new URL('https://b.example.com/?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should match a host with a trailing dot when given as hosts', () => {
    const extract = createQueryUnwrapper({
      hosts: 'go.example.com',
      params: ['u'],
    })
    const value = new URL('https://go.example.com./?u=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(extract(value)).toBe(expected)
  })

  it('should match a host with a trailing dot when given as a hosts array', () => {
    const extract = createQueryUnwrapper({
      hosts: ['a.example.com', 'go.example.com'],
      params: ['u'],
    })
    const value = new URL('https://go.example.com./?u=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(extract(value)).toBe(expected)
  })

  it('should match hosts given as a regex', () => {
    const extract = createQueryUnwrapper({
      hosts: exampleSubdomainRegex,
      params: ['url'],
    })
    const value = new URL('https://sub.example.com/?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should match the domain itself when given as domains', () => {
    const extract = createQueryUnwrapper({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should match any subdomain of a domain given as domains', () => {
    const extract = createQueryUnwrapper({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://a.b.example.com/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should match domains given as an array', () => {
    const extract = createQueryUnwrapper({
      domains: ['example.com', 'example.net'],
      params: ['url'],
    })
    const value = new URL('https://redirect.example.net/?url=https%3A%2F%2Fexample.org')
    const expected = 'https://example.org'

    expect(extract(value)).toBe(expected)
  })

  it('should return undefined for a host that only ends in a domain given as domains', () => {
    const extract = createQueryUnwrapper({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://notexample.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for a host outside the domains', () => {
    const extract = createQueryUnwrapper({
      domains: 'example.com',
      params: ['url'],
    })
    const value = new URL('https://example.net/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for an empty domain', () => {
    const extract = createQueryUnwrapper({
      domains: '',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for an empty host', () => {
    const extract = createQueryUnwrapper({
      hosts: '',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.org')

    expect(extract(value)).toBeUndefined()
  })

  it('should require the configured path when given', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/out?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should match the configured path in any case', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/OUT?url=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  it('should return undefined for a non-matching path', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      path: '/out',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/in?url=https%3A%2F%2Fexample.com')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined for non-matching hosts', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://example.com/?url=https%3A%2F%2Fexample.com')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined when the param is missing', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/?other=value')

    expect(extract(value)).toBeUndefined()
  })

  it('should return undefined when the param is empty', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/?url=')

    expect(extract(value)).toBeUndefined()
  })

  it('should match the param name in any case', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })
    const value = new URL('https://redirect.example.com/?URL=https%3A%2F%2Fexample.com')
    const expected = 'https://example.com'

    expect(extract(value)).toBe(expected)
  })

  describe('path', () => {
    it('should match any path of a list', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        path: ['/out', '/out/'],
        params: ['url'],
      })
      const value = new URL('https://redirect.example.com/out/?url=https%3A%2F%2Fexample.com')
      const expected = 'https://example.com'

      expect(extract(value)).toBe(expected)
    })

    it('should return undefined for a path outside the list', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        path: ['/out', '/out/'],
        params: ['url'],
      })
      const value = new URL('https://redirect.example.com/in?url=https%3A%2F%2Fexample.com')

      expect(extract(value)).toBeUndefined()
    })

    it('should match a path regex', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        path: clickPathRegex,
        params: ['url'],
      })
      const value = new URL('https://redirect.example.com/click/42?url=https%3A%2F%2Fexample.com')
      const expected = 'https://example.com'

      expect(extract(value)).toBe(expected)
    })

    it('should return undefined for a path the regex does not match', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        path: clickPathRegex,
        params: ['url'],
      })
      const value = new URL('https://redirect.example.com/click/abc?url=https%3A%2F%2Fexample.com')

      expect(extract(value)).toBeUndefined()
    })

    it('should match a path regex in the case it is written', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        path: lowercasePathRegex,
        params: ['url'],
      })
      const value = new URL('https://redirect.example.com/OUT?url=https%3A%2F%2Fexample.com')

      expect(extract(value)).toBeUndefined()
    })
  })

  describe('index', () => {
    it('should read the value at the index', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['url'],
        index: -1,
      })
      const value = new URL(
        'https://redirect.example.com/?url=https://redirect.example.com/?id=1&url=https%3A%2F%2Fexample.com%2Fpost',
      )
      const expected = 'https://example.com/post'

      expect(extract(value)).toBe(expected)
    })

    it('should return undefined when the value at the index is empty', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['url'],
        index: -1,
      })
      const value = new URL('https://redirect.example.com/?url=https%3A%2F%2Fexample.com&url=')

      expect(extract(value)).toBeUndefined()
    })
  })

  describe('decode', () => {
    it('should decode the target', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        decode: decodeBase64,
      })
      const value = new URL('https://redirect.example.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0')
      const expected = 'https://example.com/post'

      expect(extract(value)).toBe(expected)
    })

    it('should read a raw plus of the base64 alphabet as a plus', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['to'],
        decode: decodeBase64,
      })
      const value = new URL(
        'https://redirect.example.com/?to=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvIzp+OnRleHQ9VGhl',
      )
      const expected = 'https://www.example.org/#:~:text=The'

      expect(extract(value)).toBe(expected)
    })

    it('should return undefined for a decoded target that is not http', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        decode: decodeBase64,
      })
      const value = new URL('https://redirect.example.com/?enc=bWFpbHRvOmpvYnNAZXhhbXBsZS5jb20=')

      expect(extract(value)).toBeUndefined()
    })

    it('should decode a target whose decoded value holds an encoded scheme', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        decode: decodeBase64,
      })
      const value = new URL(
        'https://redirect.example.com/?enc=aHR0cHMlM0ElMkYlMkZleGFtcGxlLmNvbSUyRnBvc3QlM0ZhJTNEMQ==',
      )
      const expected = 'https://example.com/post?a=1'

      expect(extract(value)).toBe(expected)
    })

    it('should keep the escapes of a decoded target with a raw scheme', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        decode: decodeBase64,
      })
      const value = new URL(
        'https://redirect.example.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9zZWFyY2g/cT1hJTI2Yg==',
      )
      const expected = 'https://example.com/search?q=a%26b'

      expect(extract(value)).toBe(expected)
    })

    it('should try the next param when a value does not decode', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc', 'enc2'],
        decode: decodeBase64,
      })
      const value = new URL(
        'https://redirect.example.com/?enc=%25%25%25&enc2=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0',
      )
      const expected = 'https://example.com/post'

      expect(extract(value)).toBe(expected)
    })

    it('should decode the value at the index', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        index: -1,
        decode: decodeBase64,
      })
      const value = new URL(
        'https://redirect.example.com/?enc=aHR0cHM6Ly9leGFtcGxlLm9yZy8=&enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9wb3N0',
      )
      const expected = 'https://example.com/post'

      expect(extract(value)).toBe(expected)
    })
    it('should reject plus beside decode in the config type', () => {
      const extract = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['enc'],
        decode: decodeBase64,
        // @ts-expect-error A decoded target has no raw plus to read.
        plus: 'space',
      })
      const value = new URL('https://redirect.example.com/?enc=aHR0cHM6Ly9leGFtcGxlLmNvbS9hK2I=')
      const expected = 'https://example.com/a+b'

      expect(extract(value)).toBe(expected)
    })
  })

  describe('twice-encoded target', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })

    it('should decode a twice-encoded target whose colon was left raw', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https:%252F%252Fexample.com%252Fnews',
      )
      const expected = 'https://example.com/news'

      expect(extract(value)).toBe(expected)
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
      const value = new URL(
        'https://redirect.example.com/?url=example.com/go-https%253A%252F%252Fexample.org',
      )
      const expected = 'example.com/go-https%3A%2F%2Fexample.org'

      expect(extract(value)).toBe(expected)
    })

    it('should keep a stray percent sign in a twice-encoded target', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https%253A%252F%252Fexample.com%252F100%25',
      )
      const expected = 'https://example.com/100%'

      expect(extract(value)).toBe(expected)
    })
  })

  describe('plus in the target', () => {
    const extract = createQueryUnwrapper({
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

    it('should keep a plus in an unencoded target without a scheme', () => {
      const value = new URL('https://redirect.example.com/?wgtarget=www.example.com/a+b')
      const expected = 'www.example.com/a+b'

      expect(extract(value)).toBe(expected)
    })

    it('should keep a plus in an unencoded protocol-relative target', () => {
      const value = new URL('https://redirect.example.com/?wgtarget=//www.example.com/a+b')
      const expected = '//www.example.com/a+b'

      expect(extract(value)).toBe(expected)
    })

    it('should keep a plus in an unencoded target with one slash after the scheme', () => {
      const value = new URL('https://redirect.example.com/?wgtarget=https:/www.example.com/a+b')
      const expected = 'https:/www.example.com/a+b'

      expect(extract(value)).toBe(expected)
    })

    it('should read a plus in an encoded target without a scheme as a space', () => {
      const value = new URL(
        'https://redirect.example.com/?wgtarget=www.example.com%2Fsearch%3Fq%3DFreet+Tanga',
      )
      const expected = 'www.example.com/search?q=Freet Tanga'

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

  describe('link fragment', () => {
    const extract = createQueryUnwrapper({
      hosts: 'redirect.example.com',
      params: ['url'],
    })

    it('should keep the link fragment on an unencoded target', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https://www.example.com/guide#install',
      )
      const expected = 'https://www.example.com/guide#install'

      expect(extract(value)).toBe(expected)
    })

    it('should keep the link fragment on an encoded target', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https%3A%2F%2Fwww.example.com%2Fguide#install',
      )
      const expected = 'https://www.example.com/guide#install'

      expect(extract(value)).toBe(expected)
    })

    it('should prefer the encoded fragment of the target over the link fragment', () => {
      const value = new URL(
        'https://redirect.example.com/?url=https%3A%2F%2Fwww.example.com%2Fguide%23setup#install',
      )
      const expected = 'https://www.example.com/guide#setup'

      expect(extract(value)).toBe(expected)
    })

    it('should drop the link fragment for a link that opens a page', () => {
      const extractOwned = createQueryUnwrapper({
        hosts: 'redirect.example.com',
        params: ['url'],
        ignoreLinkFragment: true,
      })
      const value = new URL('https://redirect.example.com/?url=https://www.example.com/feed#l42')
      const expected = 'https://www.example.com/feed'

      expect(extractOwned(value)).toBe(expected)
    })
  })
})

describe('createQueryUnwrapper host index', () => {
  it('should register the hosts of a domain', () => {
    const unwrap = createQueryUnwrapper({ domains: 'example.com', params: ['target'] })

    expect(unwrapperHosts.get(unwrap)).toEqual(['.example.com'])
  })

  it('should return undefined on the domain itself for subdomains', () => {
    const unwrap = createQueryUnwrapper({ subdomains: 'example.com', params: ['target'] })
    const value = new URL('https://example.com/?target=https://example.org/post')

    expect(unwrap(value)).toBeUndefined()
  })
})

describe('createUnwrapper', () => {
  const getTarget: UrlUnwrapper = (url) => {
    return getQueryParam(url, 'target')
  }
  const unwrapHost = createUnwrapper({ hosts: 'redirect.example.com', unwrap: getTarget })
  const unwrapDomain = createUnwrapper({ domains: 'example.com', unwrap: getTarget })
  const unwrapSubdomain = createUnwrapper({ subdomains: 'example.com', unwrap: getTarget })

  it('should run the body on a listed host', () => {
    const value = new URL('https://redirect.example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapHost(value)).toBe(expected)
  })

  it('should return undefined on a host not listed', () => {
    const value = new URL('https://example.com/?target=https://example.org/post')

    expect(unwrapHost(value)).toBeUndefined()
  })

  it('should run the body on any host with anyHost', () => {
    const unwrap = createUnwrapper({ anyHost: true, unwrap: getTarget })
    const value = new URL('https://click.example.net/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrap(value)).toBe(expected)
  })

  it('should register no host with anyHost', () => {
    const unwrap = createUnwrapper({ anyHost: true, unwrap: getTarget })

    expect(unwrapperHosts.has(unwrap)).toBe(false)
  })

  it('should run the body on a domain itself', () => {
    const value = new URL('https://example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapDomain(value)).toBe(expected)
  })

  it('should run the body on a subdomain of a domain', () => {
    const value = new URL('https://go.example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapDomain(value)).toBe(expected)
  })

  it('should run the body on a subdomain', () => {
    const value = new URL('https://go.example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapSubdomain(value)).toBe(expected)
  })

  it('should return undefined on the domain itself for subdomains', () => {
    const value = new URL('https://example.com/?target=https://example.org/post')

    expect(unwrapSubdomain(value)).toBeUndefined()
  })

  it('should keep the link fragment on the target', () => {
    const value = new URL('https://redirect.example.com/?target=https://example.org/post#comments')
    const expected = 'https://example.org/post#comments'

    expect(unwrapHost(value)).toBe(expected)
  })

  it('should prefer the fragment of the target over the link fragment', () => {
    const value = new URL(
      'https://redirect.example.com/?target=https%3A%2F%2Fexample.org%2Fpost%23intro#comments',
    )
    const expected = 'https://example.org/post#intro'

    expect(unwrapHost(value)).toBe(expected)
  })

  it('should drop the link fragment when ignoreLinkFragment is set', () => {
    const unwrapIgnoring = createUnwrapper({
      hosts: 'redirect.example.com',
      unwrap: getTarget,
      ignoreLinkFragment: true,
    })
    const value = new URL('https://redirect.example.com/?target=https://example.org/post#comments')
    const expected = 'https://example.org/post'

    expect(unwrapIgnoring(value)).toBe(expected)
  })
})

describe('match', () => {
  const getTarget: UrlUnwrapper = (url) => {
    return getQueryParam(url, 'target')
  }
  const unwrapMatched = createUnwrapper({
    subdomains: 'example.com',
    match: clickHostRegex,
    unwrap: getTarget,
  })

  it('should run the body on a host the regex matches', () => {
    const value = new URL('https://click7.example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapMatched(value)).toBe(expected)
  })

  it('should return undefined on a listed host the regex does not match', () => {
    const value = new URL('https://www.example.com/?target=https://example.org/post')

    expect(unwrapMatched(value)).toBeUndefined()
  })

  it('should return undefined on a host the regex matches outside the listed hosts', () => {
    const unwrap = createUnwrapper({
      subdomains: 'example.net',
      match: clickHostRegex,
      unwrap: getTarget,
    })
    const value = new URL('https://click7.example.com/?target=https://example.org/post')

    expect(unwrap(value)).toBeUndefined()
  })

  it('should register the listed hosts in the host index', () => {
    const expected = ['.example.com']

    expect(unwrapperHosts.get(unwrapMatched)).toEqual(expected)
  })

  it('should narrow the hosts of a query unwrapper', () => {
    const unwrap = createQueryUnwrapper({
      subdomains: 'example.com',
      match: clickHostRegex,
      params: ['target'],
    })
    const value = new URL('https://www.example.com/?target=https://example.org/post')

    expect(unwrap(value)).toBeUndefined()
  })
})

describe('createUnwrapper with brands', () => {
  const getTarget: UrlUnwrapper = (url) => {
    return getQueryParam(url, 'target')
  }
  const unwrapBrand = createUnwrapper({ brands: ['example'], unwrap: getTarget })

  it('should run the body on the brand under a one-label tld', () => {
    const value = new URL('https://www.example.com/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapBrand(value)).toBe(expected)
  })

  it('should run the body on the brand under a two-label tld', () => {
    const value = new URL('https://www.example.co.uk/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrapBrand(value)).toBe(expected)
  })

  it('should return undefined on the brand deeper than a two-label tld', () => {
    const value = new URL('https://example.cdn.images.test/?target=https://example.org/post')

    expect(unwrapBrand(value)).toBeUndefined()
  })

  it('should return undefined on a label that only ends in the brand', () => {
    const value = new URL('https://notexample.com/?target=https://example.org/post')

    expect(unwrapBrand(value)).toBeUndefined()
  })

  it('should run the body on a domain given beside the brands', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      domains: 'images.test',
      unwrap: getTarget,
    })
    const value = new URL('https://site.images.test/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrap(value)).toBe(expected)
  })

  it('should run the body on a host given beside the brands', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      hosts: 'click.images.test',
      unwrap: getTarget,
    })
    const value = new URL('https://click.images.test/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrap(value)).toBe(expected)
  })

  it('should run the body on a subdomain given beside the brands', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      subdomains: 'images.test',
      unwrap: getTarget,
    })
    const value = new URL('https://site.images.test/?target=https://example.org/post')
    const expected = 'https://example.org/post'

    expect(unwrap(value)).toBe(expected)
  })

  it('should return undefined on the domain itself given as subdomains beside the brands', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      subdomains: 'images.test',
      unwrap: getTarget,
    })
    const value = new URL('https://images.test/?target=https://example.org/post')

    expect(unwrap(value)).toBeUndefined()
  })

  it('should register the brands and the hosts in the host index', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      hosts: 'click.images.test',
      unwrap: getTarget,
    })
    const expected = ['click.images.test', 'example.*']

    expect(unwrapperHosts.get(unwrap)).toEqual(expected)
  })

  it('should register the brands and the domains in the host index', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      domains: 'images.test',
      unwrap: getTarget,
    })
    const expected = ['.images.test', 'example.*']

    expect(unwrapperHosts.get(unwrap)).toEqual(expected)
  })

  it('should register nothing when a domain beside the brands is a regex', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      domains: exampleSubdomainRegex,
      unwrap: getTarget,
    })

    expect(unwrapperHosts.has(unwrap)).toBe(false)
  })

  it('should narrow the brand with match', () => {
    const unwrap = createUnwrapper({
      brands: ['example'],
      match: clickHostRegex,
      unwrap: getTarget,
    })
    const value = new URL('https://www.example.com/?target=https://example.org/post')

    expect(unwrap(value)).toBeUndefined()
  })
})

describe('getBrandLabels', () => {
  it('should return the host itself for a host of one label', () => {
    const value = 'localhost'
    const expected = ['localhost']

    expect(getBrandLabels(value)).toEqual(expected)
  })

  it('should return the label before the tld for a host of two labels', () => {
    const value = 'example.com'
    const expected = ['example']

    expect(getBrandLabels(value)).toEqual(expected)
  })

  it('should return the labels before a tld of one or two labels for a longer host', () => {
    const value = 'www.example.co.uk'
    const expected = ['co', 'example']

    expect(getBrandLabels(value)).toEqual(expected)
  })

  it('should return both labels of a host of three labels', () => {
    const value = 'example.co.uk'
    const expected = ['co', 'example']

    expect(getBrandLabels(value)).toEqual(expected)
  })

  it('should drop a trailing dot', () => {
    const value = 'www.example.com.'
    const expected = ['example', 'www']

    expect(getBrandLabels(value)).toEqual(expected)
  })
})

describe('readParamTarget', () => {
  it('should read a raw plus in an encoded target as a space by default', () => {
    const value = new URL('https://share.example.com/?url=https%3A%2F%2Fwww.example.com%2Fa+b')
    const expected = 'https://www.example.com/a b'

    expect(readParamTarget(value, 'url')).toBe(expected)
  })

  it('should keep a raw plus in an encoded target with plus set to keep', () => {
    const value = new URL('https://share.example.com/?url=https%3A%2F%2Fwww.example.com%2Fa+b')
    const expected = 'https://www.example.com/a+b'

    expect(readParamTarget(value, 'url', 0, 'keep')).toBe(expected)
  })

  it('should read a raw plus in an unencoded target as a space with plus set to space', () => {
    const value = new URL('https://share.example.com/?url=https://www.example.com/a+b')
    const expected = 'https://www.example.com/a b'

    expect(readParamTarget(value, 'url', 0, 'space')).toBe(expected)
  })

  it('should return undefined for a relative value', () => {
    const value = new URL('https://share.example.com/?url=/local/page')

    expect(readParamTarget(value, 'url')).toBeUndefined()
  })

  it('should return undefined for a value in another scheme', () => {
    const value = new URL('https://share.example.com/?url=myapp://open')

    expect(readParamTarget(value, 'url')).toBeUndefined()
  })

  it('should drop the link fragment', () => {
    const value = new URL('https://share.example.com/?url=https://www.example.com/episode&t=#195')
    const expected = 'https://www.example.com/episode'

    expect(readParamTarget(value, 'url')).toBe(expected)
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

describe('readDecodedTarget', () => {
  it('should return the target a base64 value holds', () => {
    const value = new URL('https://click.example.com/?u=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vcG9zdA')
    const expected = 'https://www.example.com/post'

    expect(readDecodedTarget(value, 'u', decodeBase64)).toBe(expected)
  })

  it('should return undefined for a relative value that decodes to junk', () => {
    const value = new URL('https://click.example.com/?u=/local/page')

    expect(readDecodedTarget(value, 'u', decodeBase64)).toBeUndefined()
  })
})
