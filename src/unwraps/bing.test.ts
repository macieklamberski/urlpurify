import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapBing } from './bing.js'

describe('unwrapBing', () => {
  it('should repair a news apiclick target the CMS spaced after its scheme', () => {
    const value =
      'http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=6a46b6d7ac584d99bf3c81b8f232bc5a&url=http%3A%2F%2F+https%3A%2F%2Fwww.example.com%2Fzh-TW%2Factivity%2F20707&c=12372153717731441417&mkt=en-us'
    const expected = 'https://www.example.com/zh-TW/activity/20707'

    expect(purifyUrl(value, { unwrappers: [unwrapBing] })).toBe(expected)
  })

  it('should extract target from u param with a1 prefix', () => {
    const value = new URL('https://www.bing.com/ck/a?!&&u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')
    const expected = 'https://example.com/page'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should extract target from u param with a2 prefix', () => {
    const value = new URL('https://www.bing.com/ck/a?u=a2aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')
    const expected = 'https://example.com/page'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should return undefined when prefix is missing', () => {
    const value = new URL('https://www.bing.com/ck/a?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(value)).toBeUndefined()
  })

  it('should keep the wrapper when the decoded value is not a url', () => {
    const value = 'https://www.bing.com/ck/a?u=a1bm90LWEtdXJs'

    expect(purifyUrl(value, { unwrappers: [unwrapBing] })).toBe(value)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://www.bing.com/ck/a?other=value')

    expect(unwrapBing(value)).toBeUndefined()
  })

  it('should return undefined for non-/ck/a paths', () => {
    const value = new URL('https://www.bing.com/search?q=test')

    expect(unwrapBing(value)).toBeUndefined()
  })

  it('should return undefined for non-Bing hosts', () => {
    const value = new URL('https://example.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(value)).toBeUndefined()
  })

  it('should extract target from news apiclick url param', () => {
    const value = new URL(
      'http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=6a46b6d7ac584d99bf3c81b8f232bc5a&url=https%3a%2f%2fexample.com%2fnews%2f112436&c=12372153717731441417&mkt=en-us',
    )
    const expected = 'https://example.com/news/112436'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=6a46b6d7ac584d99bf3c81b8f232bc5a&url=https://example.org/search/a+b&c=12372153717731441417&mkt=en-us',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should extract target from news apiclick with url as the only param', () => {
    const value = new URL(
      'https://www.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should keep query and fragment of the news apiclick target', () => {
    const value = new URL(
      'https://www.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2Fpage%3Fid%3D1%23top',
    )
    const expected = 'https://example.com/page?id=1#top'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should return undefined when news apiclick url param is missing or empty', () => {
    const missing = new URL('https://www.bing.com/news/apiclick.aspx?ref=FexRss')
    const empty = new URL('https://www.bing.com/news/apiclick.aspx?ref=FexRss&url=')

    expect(unwrapBing(missing)).toBeUndefined()
    expect(unwrapBing(empty)).toBeUndefined()
  })

  it('should keep the wrapper when the news apiclick target is not http', () => {
    const value = 'https://www.bing.com/news/apiclick.aspx?url=javascript%3Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapBing] })).toBe(value)
  })

  it('should extract a twice-encoded news apiclick target', () => {
    const value = new URL(
      'https://www.bing.com/news/apiclick.aspx?url=https%253A%252F%252Fexample.com%252Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapBing(value)).toBe(expected)
  })

  it('should return undefined for other news paths', () => {
    const value = new URL(
      'https://www.bing.com/news/search?q=example&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBing(value)).toBeUndefined()
  })

  it('should return undefined for news apiclick on non-Bing hosts', () => {
    const value = new URL('https://example.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBing(value)).toBeUndefined()
  })
})
