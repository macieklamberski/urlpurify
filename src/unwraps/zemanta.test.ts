import { describe, expect, it } from 'bun:test'
import { unwrapZemanta } from './zemanta.js'

describe('unwrapZemanta', () => {
  it('should extract target from the u param', () => {
    const url = new URL(
      'http://r.zemanta.com/?u=http%3A//www.example.com/media/2013/mar/18/press-regulation-deal-key-points&a=153142562&rid=a0a0453e-08c1-49a6-81fc-05c7f15a4bde&e=c02f796346ff8010f121b81634bd9329',
    )

    expect(unwrapZemanta(url)).toBe(
      'http://www.example.com/media/2013/mar/18/press-regulation-deal-key-points',
    )
  })

  it('should extract an https target', () => {
    const url = new URL('https://r.zemanta.com/?u=https%3A%2F%2Fexample.com%2Fpost&a=1&rid=2&e=3')

    expect(unwrapZemanta(url)).toBe('https://example.com/post')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'http://r.zemanta.com/?u=http%3A//example.com/post%3Fpartner%3Drss%26emc%3Drss&a=1&rid=2&e=3',
    )

    expect(unwrapZemanta(url)).toBe('http://example.com/post?partner=rss&emc=rss')
  })

  it('should keep the percent signs the target had encoded', () => {
    const url = new URL(
      'http://r.zemanta.com/?u=http%3A//example.com/my-take-the-bible%2525E2%252580%252599s-messages/&a=1&rid=2&e=3',
    )

    expect(unwrapZemanta(url)).toBe(
      'http://example.com/my-take-the-bible%25E2%2580%2599s-messages/',
    )
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://x.zemanta.com/?u=https%3A%2F%2Fexample.com%2F&a=1&rid=2&e=3')

    expect(unwrapZemanta(url)).toBeUndefined()
  })

  it('should return undefined for another path on the domain', () => {
    const url = new URL('https://r.zemanta.com/about?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapZemanta(url)).toBeUndefined()
  })

  it('should return undefined when the u param is missing', () => {
    const url = new URL('https://r.zemanta.com/?a=1&rid=2&e=3')

    expect(unwrapZemanta(url)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const url = new URL('https://r.zemanta.com/?u=&a=1&rid=2&e=3')

    expect(unwrapZemanta(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://tracking.example.com/?u=https%3A%2F%2Fexample.com%2F&a=1')

    expect(unwrapZemanta(url)).toBeUndefined()
  })
})
