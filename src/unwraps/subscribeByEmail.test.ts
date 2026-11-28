import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapSubscribeByEmail } from './subscribeByEmail.js'

describe('unwrapSubscribeByEmail', () => {
  it('should extract a feed that follows the host as https', () => {
    const value = new URL('http://subscribebyemail.com/example.com/rss')
    const expected = 'example.com/rss'

    expect(unwrapSubscribeByEmail(value)).toBe(expected)
  })

  it('should extract a feed on the www host', () => {
    const value = new URL(
      'https://www.subscribebyemail.com/example.com/users/soundcloud:users:157948983/sounds.rss',
    )
    const expected = 'example.com/users/soundcloud:users:157948983/sounds.rss'

    expect(unwrapSubscribeByEmail(value)).toBe(expected)
  })

  it('should extract a feed whose host has capital letters', () => {
    const value = new URL('http://subscribebyemail.com/ComicCorner.example.com/feed/')
    const expected = 'ComicCorner.example.com/feed/'

    expect(unwrapSubscribeByEmail(value)).toBe(expected)
  })

  it('should keep the query string of the feed', () => {
    const value = new URL('http://subscribebyemail.com/onthemoney.example.com/rss?PID=194')
    const expected = 'onthemoney.example.com/rss?PID=194'

    expect(unwrapSubscribeByEmail(value)).toBe(expected)
  })

  it('should keep a feed host with a port', () => {
    const value = new URL('http://subscribebyemail.com/example.com:8080/feed/podcast/')
    const expected = 'example.com:8080/feed/podcast/'

    expect(unwrapSubscribeByEmail(value)).toBe(expected)
  })

  it('should resolve a feed that kept a single-slash scheme through purifyUrl', () => {
    const value = 'https://www.subscribebyemail.com/https:/example.com/s/8901fef8/podcast/rss'
    const expected = 'https://example.com/s/8901fef8/podcast/rss'

    expect(purifyUrl(value, { unwrappers: [unwrapSubscribeByEmail] })).toBe(expected)
  })

  it('should return undefined for a page of the site', () => {
    const value = new URL('https://www.subscribebyemail.com/podcasters/')

    expect(unwrapSubscribeByEmail(value)).toBeUndefined()
  })

  it('should return undefined for a file at the root', () => {
    const value = new URL('https://www.subscribebyemail.com/favicon.ico')

    expect(unwrapSubscribeByEmail(value)).toBeUndefined()
  })

  it('should return undefined for the home page', () => {
    const value = new URL('https://www.subscribebyemail.com/')

    expect(unwrapSubscribeByEmail(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/example.org/rss')

    expect(unwrapSubscribeByEmail(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplesubscribebyemail.com/example.org/rss')

    expect(unwrapSubscribeByEmail(value)).toBeUndefined()
  })
})
