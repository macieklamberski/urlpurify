import { describe, expect, it } from 'bun:test'
import { unwrapGoogleNews } from './googleNews.js'

describe('unwrapGoogleNews', () => {
  it('should extract target from legacy news.google.com/news/url', () => {
    const value = new URL(
      'https://news.google.com/news/url?url=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapGoogleNews(value)).toBe(expected)
  })

  it('should return undefined for modern article URLs', () => {
    const value = new URL('https://news.google.com/articles/CBMiAbase64')

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://news.google.com/news/url')

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })

  it('should return undefined for non-Google-News hosts', () => {
    const value = new URL('https://www.google.com/news/url?url=https%3A%2F%2Fexample.com')

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })

  it('should extract target from news.google.de host', () => {
    const value = new URL('https://news.google.de/news/url?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapGoogleNews(value)).toBe(expected)
  })

  it('should extract target from news.google.co.uk host', () => {
    const value = new URL(
      'https://news.google.co.uk/news/url?url=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapGoogleNews(value)).toBe(expected)
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://www.news.google.com/news/url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://notnews.google.com/news/url?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path with the carrier param', () => {
    const value = new URL('https://news.google.com/news/other?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGoogleNews(value)).toBeUndefined()
  })
})
