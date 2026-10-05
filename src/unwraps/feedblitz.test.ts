import { describe, expect, it } from 'bun:test'
import { unwrapFeedblitz } from './feedblitz.js'

describe('unwrapFeedblitz', () => {
  it('should extract target from the path', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(url)).toBe('https://example.fm')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://feeds.feedblitz.com/~/t/0/0/onehundreddollarsamonth/~https://www.example.com/share?a=1#url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapFeedblitz(url)).toBe(
      'https://www.example.com/share?a=1#url=https%3A%2F%2Fexample.org%2F',
    )
  })

  it('should keep a tilde path in the target', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://www.example.edu/~user/page',
    )

    expect(unwrapFeedblitz(url)).toBe('https://www.example.edu/~user/page')
  })

  it('should extract target from the underscore path', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/~/t/0/_/inversecondemnation/~https://www.example.com/article',
    )

    expect(unwrapFeedblitz(url)).toBe('https://www.example.com/article')
  })

  it('should extract target from the full path', () => {
    const url = new URL(
      'http://feeds.feedblitz.com/~/t/0/_/lifeyourway/full/~https://www.example.com/2015/09/post/',
    )

    expect(unwrapFeedblitz(url)).toBe('https://www.example.com/2015/09/post/')
  })

  it('should add https to a target without a scheme', () => {
    const url = new URL('https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~example.com/')

    expect(unwrapFeedblitz(url)).toBe('https://example.com/')
  })

  it('should return undefined for a target without a host', () => {
    const url = new URL('https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~about')

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for an empty target', () => {
    const url = new URL('https://feeds.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~')

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for another tracker number', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/~/t/0/1/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for another tracker version', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/~/t/1/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for the feed path', () => {
    const url = new URL('https://feeds.feedblitz.com/markmcguinnesspoetry')

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for the path below another segment', () => {
    const url = new URL(
      'https://feeds.feedblitz.com/x/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://www.feedblitz.com/~/t/0/0/markmcguinnesspoetry/~https://example.fm',
    )

    expect(unwrapFeedblitz(url)).toBeUndefined()
  })
})
