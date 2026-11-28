import { describe, expect, it } from 'bun:test'
import { purifyUrl } from './clean.js'
import { createPathUnwrapper, decodePathTarget, resolvePathTarget } from './pathTarget.js'

const prefixRegex = /^\/r\/\d+\//
const prefixHostRegex = /^prefix\.example\.com$/

describe('createPathUnwrapper', () => {
  const unwrap = createPathUnwrapper({
    hosts: 'prefix.example.com',
    prefix: prefixRegex,
  })

  it('should return the target behind the prefix', () => {
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'www.example.org/episode.mp3'

    expect(unwrap(value)).toBe(expected)
  })

  it('should keep the scheme of a target that has one', () => {
    const value = new URL('https://prefix.example.com/r/42/http://www.example.org/episode.mp3')
    const expected = 'http://www.example.org/episode.mp3'

    expect(unwrap(value)).toBe(expected)
  })

  it('should decode a target whose scheme is percent-encoded', () => {
    const value = new URL(
      'https://prefix.example.com/r/42/https%3A%2F%2Fwww.example.org%2Fepisode.mp3',
    )
    const expected = 'https://www.example.org/episode.mp3'

    expect(unwrap(value)).toBe(expected)
  })

  it('should drop the query of the link after an encoded target', () => {
    const value = new URL(
      'https://prefix.example.com/r/42/https%3A%2F%2Fwww.example.org%2Fepisode.mp3%3Ft%3D60?ref=feed',
    )
    const expected = 'https://www.example.org/episode.mp3?t=60'

    expect(unwrap(value)).toBe(expected)
  })

  it('should keep the query and fragment of the link', () => {
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3?t=60#notes')
    const expected = 'www.example.org/episode.mp3?t=60#notes'

    expect(unwrap(value)).toBe(expected)
  })

  it('should drop the link fragment when ignoreLinkFragment is set', () => {
    const unwrapIgnoring = createPathUnwrapper({
      hosts: 'prefix.example.com',
      prefix: prefixRegex,
      ignoreLinkFragment: true,
    })
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3?t=60#notes')
    const expected = 'www.example.org/episode.mp3?t=60'

    expect(unwrapIgnoring(value)).toBe(expected)
  })

  it('should return undefined for another host', () => {
    const value = new URL('https://other.example.com/r/42/www.example.org/episode.mp3')

    expect(unwrap(value)).toBeUndefined()
  })

  it('should return undefined for a path without the prefix', () => {
    const value = new URL('https://prefix.example.com/feed/www.example.org/episode.mp3')

    expect(unwrap(value)).toBeUndefined()
  })

  it('should leave a feed scheme to the url repair', () => {
    const value = 'https://prefix.example.com/r/42/feed://www.example.org/feed.xml'
    const expected = 'https://www.example.org/feed.xml'

    expect(purifyUrl(value, { unwrappers: [unwrap] })).toBe(expected)
  })

  it('should give a target without a scheme http when the scheme is http', () => {
    const unwrapHttp = createPathUnwrapper({
      hosts: 'prefix.example.com',
      prefix: prefixRegex,
      scheme: 'http',
    })
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'http://www.example.org/episode.mp3'

    expect(unwrapHttp(value)).toBe(expected)
  })

  it('should give a target without a scheme the scheme of the link when the scheme is link', () => {
    const unwrapLink = createPathUnwrapper({
      hosts: 'prefix.example.com',
      prefix: prefixRegex,
      scheme: 'link',
    })
    const value = new URL('http://prefix.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'http://www.example.org/episode.mp3'

    expect(unwrapLink(value)).toBe(expected)
  })

  it('should match a subdomain of a domain given as domains', () => {
    const unwrapDomain = createPathUnwrapper({
      domains: 'example.com',
      prefix: prefixRegex,
    })
    const value = new URL('https://cdn.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'www.example.org/episode.mp3'

    expect(unwrapDomain(value)).toBe(expected)
  })

  it('should return undefined on a listed host that match does not match', () => {
    const unwrapMatched = createPathUnwrapper({
      subdomains: 'example.com',
      match: prefixHostRegex,
      prefix: prefixRegex,
    })
    const value = new URL('https://www.example.com/r/42/www.example.org/episode.mp3')

    expect(unwrapMatched(value)).toBeUndefined()
  })

  it('should return the target on a host that match matches', () => {
    const unwrapMatched = createPathUnwrapper({
      subdomains: 'example.com',
      match: prefixHostRegex,
      prefix: prefixRegex,
    })
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'www.example.org/episode.mp3'

    expect(unwrapMatched(value)).toBe(expected)
  })
})

describe('decodePathTarget', () => {
  it('should decode a target whose scheme is percent-encoded', () => {
    const value = 'https%3A%2F%2Fexample.com%2Fa%2520b.mp3'
    const expected = 'https://example.com/a%20b.mp3'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should decode a target whose scheme is percent-encoded twice', () => {
    const value = 'https%253A%252F%252Fexample.com%252Fa.mp3'
    const expected = 'https://example.com/a.mp3'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should decode a target whose slashes are percent-encoded after a raw colon', () => {
    const value = 'https:%2F%2Fexample.com%2Fnews'
    const expected = 'https://example.com/news'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should decode a target whose slashes are percent-encoded twice after a raw colon', () => {
    const value = 'https:%252F%252Fexample.com%252Fnews'
    const expected = 'https://example.com/news'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should decode a target whose colon alone is percent-encoded', () => {
    const value = 'http%3A//example.com/a%20b'
    const expected = 'http://example.com/a b'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should keep a raw target with a scheme as written', () => {
    const value = 'https://example.com/a%20b.mp3'
    const expected = 'https://example.com/a%20b.mp3'

    expect(decodePathTarget(value)).toBe(expected)
  })

  it('should keep a raw target without a scheme as written', () => {
    const value = 'example.com/a%2Fb.mp3'
    const expected = 'example.com/a%2Fb.mp3'

    expect(decodePathTarget(value)).toBe(expected)
  })
})

describe('resolvePathTarget', () => {
  it('should keep the query of the link after a raw target', () => {
    const url = new URL('https://wrapper.example.com/r/https://example.com/post?id=7')
    const value = 'https://example.com/post'
    const expected = 'https://example.com/post?id=7'

    expect(resolvePathTarget(url, value)).toBe(expected)
  })

  it('should drop the query of the link after an encoded target', () => {
    const url = new URL('https://wrapper.example.com/r/https%3A%2F%2Fexample.com%2Fpost?w=640')
    const value = 'https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(resolvePathTarget(url, value)).toBe(expected)
  })

  it('should drop the query of the link after a target encoded twice', () => {
    const url = new URL(
      'https://wrapper.example.com/r/https%253A%252F%252Fexample.com%252Fpost?w=640',
    )
    const value = 'https%253A%252F%252Fexample.com%252Fpost'
    const expected = 'https://example.com/post'

    expect(resolvePathTarget(url, value)).toBe(expected)
  })

  it('should keep the query of the link after a target with its colon alone encoded', () => {
    const url = new URL('https://wrapper.example.com/r/https%3A//example.com/post?id=7')
    const value = 'https%3A//example.com/post'
    const expected = 'https://example.com/post?id=7'

    expect(resolvePathTarget(url, value)).toBe(expected)
  })

  it('should give a target without a scheme the scheme passed', () => {
    const url = new URL('https://wrapper.example.com/r/example.com/post')
    const value = 'example.com/post'
    const expected = 'http://example.com/post'

    expect(resolvePathTarget(url, value, 'http:')).toBe(expected)
  })

  it('should keep the scheme of a decoded target over the scheme passed', () => {
    const url = new URL('https://wrapper.example.com/r/https%3A%2F%2Fexample.com%2Fpost')
    const value = 'https%3A%2F%2Fexample.com%2Fpost'
    const expected = 'https://example.com/post'

    expect(resolvePathTarget(url, value, 'http:')).toBe(expected)
  })

  it('should leave a target without a scheme as written with no scheme passed', () => {
    const url = new URL('https://wrapper.example.com/r/example.com/post')
    const value = 'example.com/post'

    expect(resolvePathTarget(url, value)).toBe(value)
  })
})
