import { describe, expect, it } from 'bun:test'
import { getQueryParam } from 'trousse'
import type { UrlUnwrapper } from './types.js'
import {
  createQueryUnwrapper,
  createUnwrapper,
  getParamTarget,
  getUtf8ByteLength,
  readParamTarget,
  unwrapperHosts,
} from './utils.js'

const exampleSubdomainRegex = /\.example\.com$/

describe('createQueryUnwrapper', () => {
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

  describe('twice-encoded target', () => {
    const extract = createQueryUnwrapper({
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

describe('readParamTarget', () => {
  it('should drop the link fragment', () => {
    const value = new URL('https://share.example.com/?url=https://www.example.com/episode&t=#195')
    const expected = 'https://www.example.com/episode'

    expect(readParamTarget(value, 'url')).toBe(expected)
  })
})

describe('getParamTarget', () => {
  it('should keep the link fragment on an unencoded target', () => {
    const value = new URL('https://redirect.example.com/?url=https://www.example.com/guide#install')
    const expected = 'https://www.example.com/guide#install'

    expect(getParamTarget(value, 'url')).toBe(expected)
  })

  it('should prefer the encoded fragment of the target over the link fragment', () => {
    const value = new URL(
      'https://redirect.example.com/?url=https%3A%2F%2Fwww.example.com%2Fguide%23setup#install',
    )
    const expected = 'https://www.example.com/guide#setup'

    expect(getParamTarget(value, 'url')).toBe(expected)
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
