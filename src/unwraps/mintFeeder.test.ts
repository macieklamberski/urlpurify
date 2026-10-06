import { describe, expect, it } from 'bun:test'
import { unwrapMintFeeder } from './mintFeeder.js'

describe('unwrapMintFeeder', () => {
  it('should extract the target from the seed param', () => {
    const url = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&feed=Articles+%28rss2%29&seed=http%3A%2F%2Fwww.example.com%2F2008%2F06%2F27%2Fprogrammhinweis%2F&seed_title=Programmhinweis',
    )

    expect(unwrapMintFeeder(url)).toBe('http://www.example.com/2008/06/27/programmhinweis/')
  })

  it('should return undefined for another Feeder action', () => {
    const url = new URL(
      'http://www.example.com/feeder/?FeederAction=subscribed&seed=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMintFeeder(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'http://www.example.com/stats/feeder/?FeederAction=clicked&seed=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapMintFeeder(url)).toBeUndefined()
  })

  it('should return undefined for a non-http seed', () => {
    const url = new URL(
      'http://www.example.com/feeder/?FeederAction=clicked&seed=javascript%3Aalert(1)',
    )

    expect(unwrapMintFeeder(url)).toBeUndefined()
  })
})
