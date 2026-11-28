import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapWindowsLive } from './windowsLive.js'

describe('unwrapWindowsLive', () => {
  it('should give https to a feed without a scheme', () => {
    const value = 'http://www.live.com/?add=feeds.example.com%2Fblog'
    const expected = 'https://feeds.example.com/blog'

    expect(purifyUrl(value, { unwrappers: [unwrapWindowsLive] })).toBe(expected)
  })

  it('should extract a percent-encoded feed', () => {
    const value = new URL('http://www.live.com/?add=http%3A%2F%2Ffeeds.example.com%2Ftechackr')
    const expected = 'http://feeds.example.com/techackr'

    expect(unwrapWindowsLive(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL('http://www.live.com/?add=http://rss.example.com/ccc-wedpm')
    const expected = 'http://rss.example.com/ccc-wedpm'

    expect(unwrapWindowsLive(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL('http://www.live.com/?add=http%253A%252F%252Fexample.com%252Ffeed')
    const expected = 'http://example.com/feed'

    expect(unwrapWindowsLive(value)).toBe(expected)
  })

  it('should keep the wrapper for an add value that is not a url', () => {
    const value = 'http://www.live.com/?add=gadget'

    expect(purifyUrl(value, { unwrappers: [unwrapWindowsLive] })).toBe(value)
  })

  it('should return undefined for an empty add', () => {
    const value = new URL('http://www.live.com/?add=')

    expect(unwrapWindowsLive(value)).toBeUndefined()
  })

  it('should return undefined without add', () => {
    const value = new URL('http://www.live.com/')

    expect(unwrapWindowsLive(value)).toBeUndefined()
  })

  it('should return undefined for add on another path', () => {
    const value = new URL('http://www.live.com/news?add=http%3A%2F%2Fexample.com%2Ffeed')

    expect(unwrapWindowsLive(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://www.example.com/?add=http%3A%2F%2Fexample.com%2Ffeed')

    expect(unwrapWindowsLive(value)).toBeUndefined()
  })
})
