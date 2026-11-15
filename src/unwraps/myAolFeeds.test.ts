import { describe, expect, it } from 'bun:test'
import { unwrapMyAolFeeds } from './myAolFeeds.js'

describe('unwrapMyAolFeeds', () => {
  it('should extract a percent-encoded feed', () => {
    const value = new URL(
      'http://feeds.my.aol.com/add.jsp?url=http%3A%2F%2Ffeeds.example.com%2Ftechackr',
    )
    const expected = 'http://feeds.example.com/techackr'

    expect(unwrapMyAolFeeds(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL(
      'http://feeds.my.aol.com/add.jsp?url=http://feeds2.example.com/blogspot/WyNa',
    )
    const expected = 'http://feeds2.example.com/blogspot/WyNa'

    expect(unwrapMyAolFeeds(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'http://feeds.my.aol.com/add.jsp?url=http%253A%252F%252Fexample.com%252Ffeed',
    )
    const expected = 'http://example.com/feed'

    expect(unwrapMyAolFeeds(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://feeds.my.aol.com/ADD.JSP?url=http://example.com/feed')
    const expected = 'http://example.com/feed'

    expect(unwrapMyAolFeeds(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('http://feeds.my.aol.com/add.jsp?url=')

    expect(unwrapMyAolFeeds(value)).toBeUndefined()
  })

  it('should return undefined without a url', () => {
    const value = new URL('http://feeds.my.aol.com/add.jsp')

    expect(unwrapMyAolFeeds(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('http://feeds.my.aol.com/view.jsp?url=http://example.com/feed')

    expect(unwrapMyAolFeeds(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://my.aol.com/add.jsp?url=http://example.com/feed')

    expect(unwrapMyAolFeeds(value)).toBeUndefined()
  })
})
