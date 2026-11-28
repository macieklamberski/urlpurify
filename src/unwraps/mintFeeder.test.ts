import { describe, expect, it } from 'bun:test'
import { unwrapMintFeeder } from './mintFeeder.js'

describe('unwrapMintFeeder', () => {
  it('should extract the target from the seed param', () => {
    const value = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&feed=Articles+%28rss2%29&seed=http%3A%2F%2Fwww.example.com%2F2008%2F06%2F27%2Fprogrammhinweis%2F&seed_title=Programmhinweis',
    )
    const expected = 'http://www.example.com/2008/06/27/programmhinweis/'

    expect(unwrapMintFeeder(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&feed=Articles+%28rss2%29&seed=https%253A%252F%252Fexample.org%252Fpage&seed_title=Programmhinweis',
    )
    const expected = 'https://example.org/page'

    expect(unwrapMintFeeder(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&feed=Articles+%28rss2%29&seed=https://example.org/search/a+b&seed_title=Programmhinweis',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapMintFeeder(value)).toBe(expected)
  })

  it('should return undefined for another Feeder action', () => {
    const value = new URL(
      'http://www.example.com/feeder/?FeederAction=subscribed&seed=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMintFeeder(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'http://www.example.com/stats/feeder/?FeederAction=clicked&seed=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMintFeeder(value)).toBeUndefined()
  })

  it('should return undefined for a non-http seed', () => {
    const value = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&seed=javascript%3Aalert(1)',
    )

    expect(unwrapMintFeeder(value)).toBeUndefined()
  })
})
