import { describe, expect, it } from 'bun:test'
import { unwrapFeedblitz } from './feedblitz.js'

describe('unwrapFeedblitz', () => {
  it('should extract target from the path', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )
    const expected = 'https://example.fm'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://feeds.feedblitz.com/~/t/0/0/onehundreddollarsamonth/~https://www.example.com/share?a=1#url=https%3A%2F%2Fexample.org%2F',
    )
    const expected = 'https://www.example.com/share?a=1#url=https%3A%2F%2Fexample.org%2F'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should keep a tilde path in the target', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://www.example.edu/~user/page',
    )
    const expected = 'https://www.example.edu/~user/page'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should extract target from the underscore path', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/~/t/0/_/inversecondemnation/~https://www.example.com/article',
    )
    const expected = 'https://www.example.com/article'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should extract target from the full path', () => {
    const value = new URL(
      'http://feeds.feedblitz.com/~/t/0/_/lifeyourway/full/~https://www.example.com/2015/09/post/',
    )
    const expected = 'https://www.example.com/2015/09/post/'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should return a target without a scheme as written', () => {
    const value = new URL('https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~example.com/')
    const expected = 'example.com/'

    expect(unwrapFeedblitz(value)).toBe(expected)
  })

  it('should return undefined for an empty target', () => {
    const value = new URL('https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~')

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })

  it('should return undefined for another tracker number', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/~/t/0/1/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })

  it('should return undefined for another tracker version', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/~/t/1/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })

  it('should return undefined for the feed path', () => {
    const value = new URL('https://feeds.feedblitz.com/markmcguinnesspoetry')

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })

  it('should return undefined for the path below another segment', () => {
    const value = new URL(
      'https://feeds.feedblitz.com/x/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'https://www.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(value)).toBeUndefined()
  })
})
