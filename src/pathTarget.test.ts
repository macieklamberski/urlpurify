import { describe, expect, it } from 'bun:test'
import { createPathUnwrapper } from './pathTarget.js'

const prefixRegex = /^\/r\/\d+\//
const prefixHostRegex = /^prefix\.example\.com$/

describe('createPathUnwrapper', () => {
  const unwrap = createPathUnwrapper({
    hosts: 'prefix.example.com',
    prefix: prefixRegex,
  })

  it('should return the target behind the prefix', () => {
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3')
    const expected = 'https://www.example.org/episode.mp3'

    expect(unwrap(value)).toBe(expected)
  })

  it('should keep the scheme of a target that has one', () => {
    const value = new URL('https://prefix.example.com/r/42/http://www.example.org/episode.mp3')
    const expected = 'http://www.example.org/episode.mp3'

    expect(unwrap(value)).toBe(expected)
  })

  it('should keep the query and fragment of the link', () => {
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3?t=60#notes')
    const expected = 'https://www.example.org/episode.mp3?t=60#notes'

    expect(unwrap(value)).toBe(expected)
  })

  it('should drop the link fragment when ignoreLinkFragment is set', () => {
    const unwrapIgnoring = createPathUnwrapper({
      hosts: 'prefix.example.com',
      prefix: prefixRegex,
      ignoreLinkFragment: true,
    })
    const value = new URL('https://prefix.example.com/r/42/www.example.org/episode.mp3?t=60#notes')
    const expected = 'https://www.example.org/episode.mp3?t=60'

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
    const expected = 'https://www.example.org/episode.mp3'

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
    const expected = 'https://www.example.org/episode.mp3'

    expect(unwrapMatched(value)).toBe(expected)
  })
})
