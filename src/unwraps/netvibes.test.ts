import { describe, expect, it } from 'bun:test'
import { unwrapNetvibes } from './netvibes.js'

describe('unwrapNetvibes', () => {
  it('should extract a percent-encoded feed', () => {
    const value = new URL(
      'http://www.netvibes.com/subscribe.php?url=http%3A%2F%2Ffeeds.example.com%2Ftechackr',
    )
    const expected = 'http://feeds.example.com/techackr'

    expect(unwrapNetvibes(value)).toBe(expected)
  })

  it('should extract a raw feed', () => {
    const value = new URL(
      'http://www.netvibes.com/subscribe.php?url=https://www.example.com/feed/podcast/',
    )
    const expected = 'https://www.example.com/feed/podcast/'

    expect(unwrapNetvibes(value)).toBe(expected)
  })

  it('should extract a feed on the bare host', () => {
    const value = new URL(
      'https://netvibes.com/subscribe.php?url=https%3A%2F%2Fexample.com%2Ffeed%2F',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapNetvibes(value)).toBe(expected)
  })

  it('should decode a twice-encoded feed', () => {
    const value = new URL(
      'http://www.netvibes.com/subscribe.php?url=http%253A%252F%252Fexample.com%252Ffeed',
    )
    const expected = 'http://example.com/feed'

    expect(unwrapNetvibes(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://www.netvibes.com/Subscribe.php?url=http://example.com/feed')
    const expected = 'http://example.com/feed'

    expect(unwrapNetvibes(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('http://www.netvibes.com/subscribe.php?url=')

    expect(unwrapNetvibes(value)).toBeUndefined()
  })

  it('should return undefined without a url', () => {
    const value = new URL('http://www.netvibes.com/subscribe.php')

    expect(unwrapNetvibes(value)).toBeUndefined()
  })

  it('should return undefined for the share path', () => {
    const value = new URL(
      'http://www.netvibes.com/share?title=Post&url=http%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapNetvibes(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://www.example.com/subscribe.php?url=http%3A%2F%2Ffeeds.example.com%2Ftechackr',
    )

    expect(unwrapNetvibes(value)).toBeUndefined()
  })
})
