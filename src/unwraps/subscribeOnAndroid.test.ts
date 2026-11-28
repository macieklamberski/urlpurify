import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapSubscribeOnAndroid } from './subscribeOnAndroid.js'

describe('unwrapSubscribeOnAndroid', () => {
  it('should extract a feed that follows the host', () => {
    const value = new URL(
      'http://subscribeonandroid.com/example.com/users/soundcloud:users:170290482/sounds.rss',
    )
    const expected = 'example.com/users/soundcloud:users:170290482/sounds.rss'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should extract a feed on the www host', () => {
    const value = new URL('https://www.subscribeonandroid.com/example.com/s/8901fef8/podcast/rss')
    const expected = 'example.com/s/8901fef8/podcast/rss'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should extract a feed whose host has capital letters', () => {
    const value = new URL('http://subscribeonandroid.com/NRR.example.com/feed/')
    const expected = 'NRR.example.com/feed/'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should keep the query string of the feed', () => {
    const value = new URL(
      'http://subscribeonandroid.com/www.example.com/rss_search.rss?speakeronly=true&keyword=Pastor+Edward+Donnelly',
    )
    const expected =
      'www.example.com/rss_search.rss?speakeronly=true&keyword=Pastor+Edward+Donnelly'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should keep a percent-encoded path of the feed as written', () => {
    const value = new URL(
      'https://www.subscribeonandroid.com/example.com/internet-talk-radio/category/podcasts/Former%20Shows%20&%20Episodes/paranormal-is-normal/feed',
    )
    const expected =
      'example.com/internet-talk-radio/category/podcasts/Former%20Shows%20&%20Episodes/paranormal-is-normal/feed'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should keep a feed host with a port', () => {
    const value = new URL('http://subscribeonandroid.com/example.com:8080/feed/podcast/')
    const expected = 'example.com:8080/feed/podcast/'

    expect(unwrapSubscribeOnAndroid(value)).toBe(expected)
  })

  it('should resolve a feed that kept a single-slash scheme through purifyUrl', () => {
    const value = 'https://www.subscribeonandroid.com/https:/example.com/s/8901fef8/podcast/rss'
    const expected = 'https://example.com/s/8901fef8/podcast/rss'

    expect(purifyUrl(value, { unwrappers: [unwrapSubscribeOnAndroid] })).toBe(expected)
  })

  it('should return undefined for a page of the site', () => {
    const value = new URL('https://www.subscribeonandroid.com/podcasters/')

    expect(unwrapSubscribeOnAndroid(value)).toBeUndefined()
  })

  it('should return undefined for a file at the root', () => {
    const value = new URL('https://www.subscribeonandroid.com/favicon.ico')

    expect(unwrapSubscribeOnAndroid(value)).toBeUndefined()
  })

  it('should return undefined for the home page', () => {
    const value = new URL('https://www.subscribeonandroid.com/')

    expect(unwrapSubscribeOnAndroid(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/example.org/feed/podcast/')

    expect(unwrapSubscribeOnAndroid(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplesubscribeonandroid.com/example.org/feed/podcast/')

    expect(unwrapSubscribeOnAndroid(value)).toBeUndefined()
  })
})
