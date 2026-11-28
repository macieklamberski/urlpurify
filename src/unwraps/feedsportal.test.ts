import { describe, expect, it } from 'bun:test'
import { unwrapFeedsportal } from './feedsportal.js'

describe('unwrapFeedsportal', () => {
  it('should decode a digraph-encoded id to the original article URL', () => {
    const value = new URL(
      'http://rss.feedsportal.com/c/33858/f/609641/s/4913512d/sc/21/l/0L0Sadweek0N0Cadfreak0C50Ebrilliantly0Efaked0Eviral0Eads0Epeople0Estill0Ekeep0Ethinking0Eare0Ereal0E167325/story01.htm',
    )

    const expected =
      'http://www.adweek.com/adfreak/5-brilliantly-faked-viral-ads-people-still-keep-thinking-are-real-167325'

    expect(unwrapFeedsportal(value)).toBe(expected)
  })

  it('should return undefined when the path does not match the wrapper shape', () => {
    const value = new URL('http://rss.feedsportal.com/news/foo.html')

    expect(unwrapFeedsportal(value)).toBeUndefined()
  })

  it('should return undefined when the decoded result has no http(s) prefix', () => {
    const value = new URL('http://rss.feedsportal.com/c/x/0Zexample0Nzzzzzzzzzz/story01.htm')

    expect(unwrapFeedsportal(value)).toBeUndefined()
  })

  it('should return undefined when the id contains no digraphs and decodes to a literal', () => {
    const value = new URL('http://rss.feedsportal.com/c/x/abcdefghijklmnopqrstuvwx/story01.htm')

    expect(unwrapFeedsportal(value)).toBeUndefined()
  })
})
