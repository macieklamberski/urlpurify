import { describe, expect, it } from 'bun:test'
import { unwrapAddToAnySubscribe } from './addToAnySubscribe.js'

describe('unwrapAddToAnySubscribe', () => {
  it('should extract the feed from linkurl after an empty linkname', () => {
    const value = new URL(
      'http://www.addtoany.com/subscribe?linkname=&linkurl=http%3A%2F%2Ffeeds.example.com%2FBuildTheChurch',
    )
    const expected = 'http://feeds.example.com/BuildTheChurch'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should extract the feed from linkurl before linkname', () => {
    const value = new URL(
      'http://www.addtoany.com/subscribe?linkurl=http%3A%2F%2Fexample.blogspot.com%2F&linkname=Democratic%20Progressive%20Party%20(DPP%20Taiwan)',
    )
    const expected = 'http://example.blogspot.com/'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should keep the encoded query of the feed', () => {
    const value = new URL(
      'https://www.addtoany.com/subscribe?linkname=&linkurl=http%3A%2F%2Fblog.example.com%2F%3Ffeed%3Drss2',
    )
    const expected = 'http://blog.example.com/?feed=rss2'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should extract the feed from url', () => {
    const value = new URL(
      'https://www.addtoany.com/subscribe?url=https%3A%2F%2Fexample.com%2Ffeed%2F',
    )
    const expected = 'https://example.com/feed/'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should extract the feed on the apex host', () => {
    const value = new URL('https://addtoany.com/subscribe?linkurl=https%3A%2F%2Fexample.com%2Ffeed')
    const expected = 'https://example.com/feed'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed', () => {
    const value = new URL(
      'https://www.addtoany.com/subscribe?linkurl=https%253A%252F%252Fexample.com%252Ffeed',
    )
    const expected = 'https://example.com/feed'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should cut a raw feed at its first ampersand', () => {
    const value = new URL(
      'https://www.addtoany.com/subscribe?linkurl=http://example.com/feed?a=1&b=2',
    )
    const expected = 'http://example.com/feed?a=1'

    expect(unwrapAddToAnySubscribe(value)).toBe(expected)
  })

  it('should return undefined for a share path with linkurl', () => {
    const value = new URL(
      'https://www.addtoany.com/add_to/facebook?linkurl=https%3A%2F%2Fwww.example.com%2F127%2F&linkname=Post',
    )

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })

  it('should return undefined for the share_save path', () => {
    const value = new URL(
      'http://www.addtoany.com/share_save?linkurl=https%3A%2F%2Fwww.example.com%2Fblog%2Fpost&linkname=Post',
    )

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })

  it('should return undefined for the subscribe form without a feed', () => {
    const value = new URL('https://www.addtoany.com/subscribe')

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })

  it('should return undefined for an empty linkurl', () => {
    const value = new URL('https://www.addtoany.com/subscribe?linkname=&linkurl=')

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/subscribe?linkurl=https%3A%2F%2Fexample.org%2Ffeed')

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://www.exampleaddtoany.com/subscribe?linkurl=https%3A%2F%2Fexample.org%2Ffeed',
    )

    expect(unwrapAddToAnySubscribe(value)).toBeUndefined()
  })
})
