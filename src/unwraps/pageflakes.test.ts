import { describe, expect, it } from 'bun:test'
import { unwrapPageflakes } from './pageflakes.js'

describe('unwrapPageflakes', () => {
  it('should extract a percent-encoded feed', () => {
    const value = new URL(
      'http://www.pageflakes.com/subscribe.aspx?url=http%3A%2F%2Ffeeds.example.com%2Fjoshlam',
    )
    const expected = 'http://feeds.example.com/joshlam'

    expect(unwrapPageflakes(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL('http://www.pageflakes.com/subscribe.aspx?url=http://example.com/feed/')
    const expected = 'http://example.com/feed/'

    expect(unwrapPageflakes(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'http://www.pageflakes.com/subscribe.aspx?url=http%253A%252F%252Fexample.com%252Ffeed',
    )
    const expected = 'http://example.com/feed'

    expect(unwrapPageflakes(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://www.pageflakes.com/Subscribe.aspx?url=http://example.com/feed')
    const expected = 'http://example.com/feed'

    expect(unwrapPageflakes(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('http://www.pageflakes.com/subscribe.aspx?url=')

    expect(unwrapPageflakes(value)).toBeUndefined()
  })

  it('should return undefined without a url', () => {
    const value = new URL('http://www.pageflakes.com/subscribe.aspx')

    expect(unwrapPageflakes(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://www.pageflakes.com/default.aspx?url=http%3A%2F%2Fexample.com%2Ffeed',
    )

    expect(unwrapPageflakes(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://www.example.com/subscribe.aspx?url=http%3A%2F%2Fexample.com%2Ffeed',
    )

    expect(unwrapPageflakes(value)).toBeUndefined()
  })
})
