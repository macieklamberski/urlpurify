import { describe, expect, it } from 'bun:test'
import { unwrapFeedStatistics } from './feedStatistics.js'

describe('unwrapFeedStatistics', () => {
  it('should extract target from feed-stats-url param', () => {
    const url = new URL(
      'https://americapodcast.com.br/?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vZXBpc29kZXMvNDI%3D&feed-stats-url-post-id=1362',
    )

    expect(unwrapFeedStatistics(url)).toBe('https://www.example.com/episodes/42')
  })

  it('should extract target from unpadded base64', () => {
    const url = new URL(
      'http://blog.example.de/?feed-stats-url=aHR0cHM6Ly90c2IuZXhhbXBsZS5jb20&feed-stats-url-post-id=177',
    )

    expect(unwrapFeedStatistics(url)).toBe('https://tsb.example.com')
  })

  it('should extract target without the post id', () => {
    const url = new URL(
      'https://blog.example.de/?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vZXBpc29kZXMvNDI%3D',
    )

    expect(unwrapFeedStatistics(url)).toBe('https://www.example.com/episodes/42')
  })

  it('should extract target on a blog under an install path', () => {
    const url = new URL(
      'https://www.example.com/blog/?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvcGFnZT9hPTEmYj0y&feed-stats-url-post-id=88',
    )

    expect(unwrapFeedStatistics(url)).toBe('https://www.example.org/page?a=1&b=2')
  })

  it('should extract target on a blog under two path segments', () => {
    const url = new URL(
      'https://www.example.com/blogs/noticias/?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvcGFnZT9hPTEmYj0y&feed-stats-url-post-id=88',
    )

    expect(unwrapFeedStatistics(url)).toBe('https://www.example.org/page?a=1&b=2')
  })

  it('should return undefined for a post path', () => {
    const url = new URL(
      'https://www.example.com/2024/05/post?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvcGFnZT9hPTEmYj0y',
    )

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })

  it('should return undefined for a path under three segments', () => {
    const url = new URL(
      'https://www.example.com/a/b/c/?feed-stats-url=aHR0cHM6Ly93d3cuZXhhbXBsZS5vcmcvcGFnZT9hPTEmYj0y',
    )

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })

  it('should return undefined for a value that is not base64', () => {
    const url = new URL('https://www.example.com/?feed-stats-url=not*base64')

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://www.example.com/?feed-stats-url=amF2YXNjcmlwdDphbGVydCgxKQ%3D%3D')

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })

  it('should return undefined for the post view pixel', () => {
    const url = new URL('https://www.example.com/?feed-stats-post-id=1362')

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })

  it('should return undefined when feed-stats-url param is empty', () => {
    const url = new URL('https://www.example.com/?feed-stats-url=&feed-stats-url-post-id=1362')

    expect(unwrapFeedStatistics(url)).toBeUndefined()
  })
})
