import { describe, expect, it } from 'bun:test'
import { unwrapBing } from './bing.js'

describe('unwrapBing', () => {
  it('should extract target from u param with a1 prefix', () => {
    const url = new URL('https://www.bing.com/ck/a?!&&u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should extract target from u param with a2 prefix', () => {
    const url = new URL('https://www.bing.com/ck/a?u=a2aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should accept cn.bing.com host', () => {
    const url = new URL('https://cn.bing.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should accept bing.com without www subdomain', () => {
    const url = new URL('https://bing.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should return undefined when prefix is missing', () => {
    const url = new URL('https://www.bing.com/ck/a?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined when decoded value is not http(s)', () => {
    const url = new URL('https://www.bing.com/ck/a?u=a1bm90LWEtdXJs')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://www.bing.com/ck/a?other=value')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for non-/ck/a paths', () => {
    const url = new URL('https://www.bing.com/search?q=test')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for non-Bing hosts', () => {
    const url = new URL('https://example.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should extract target from news apiclick url param', () => {
    const url = new URL(
      'http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=6a46b6d7ac584d99bf3c81b8f232bc5a&url=https%3a%2f%2fexample.com%2fnews%2f112436&c=12372153717731441417&mkt=en-us',
    )

    expect(unwrapBing(url)).toBe('https://example.com/news/112436')
  })

  it('should extract target from news apiclick with url as the only param', () => {
    const url = new URL('https://www.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBing(url)).toBe('https://example.com/')
  })

  it('should accept search-result redirect on ssl.bing.com', () => {
    const url = new URL('https://ssl.bing.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should keep query and fragment of the news apiclick target', () => {
    const url = new URL(
      'https://www.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2Fpage%3Fid%3D1%23top',
    )

    expect(unwrapBing(url)).toBe('https://example.com/page?id=1#top')
  })

  it('should return undefined when news apiclick url param is missing or empty', () => {
    const missing = new URL('https://www.bing.com/news/apiclick.aspx?ref=FexRss')
    const empty = new URL('https://www.bing.com/news/apiclick.aspx?ref=FexRss&url=')

    expect(unwrapBing(missing)).toBeUndefined()
    expect(unwrapBing(empty)).toBeUndefined()
  })

  it('should return undefined when news apiclick target is not http(s)', () => {
    const url = new URL('https://www.bing.com/news/apiclick.aspx?url=javascript%3Aalert(1)')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined when news apiclick target is twice encoded', () => {
    const url = new URL(
      'https://www.bing.com/news/apiclick.aspx?url=https%253A%252F%252Fexample.com%252Fpage',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for other news paths', () => {
    const url = new URL(
      'https://www.bing.com/news/search?q=example&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for news apiclick on non-Bing hosts', () => {
    const url = new URL('https://example.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for hosts ending in bing.com', () => {
    const url = new URL(
      'https://examplebing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for a bing subdomain of another domain', () => {
    const url = new URL(
      'https://bing.example.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should accept search-result redirect on www.bing.de', () => {
    const url = new URL('https://www.bing.de/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl')

    expect(unwrapBing(url)).toBe('https://example.com/page')
  })

  it('should return undefined for news apiclick on an unlisted subdomain', () => {
    const url = new URL(
      'https://edge.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should return undefined for news apiclick on an unlisted country domain', () => {
    const url = new URL(
      'https://www.bing.co.uk/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapBing(url)).toBeUndefined()
  })

  it('should accept news apiclick on www4.bing.com', () => {
    const url = new URL('https://www4.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBing(url)).toBe('https://example.com/')
  })

  it('should accept news apiclick on global.bing.com', () => {
    const url = new URL(
      'https://global.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBing(url)).toBe('https://example.com/')
  })
})
