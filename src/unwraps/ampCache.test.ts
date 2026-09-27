import { describe, expect, it } from 'bun:test'
import { unwrapAmpCache } from './ampCache.js'

describe('unwrapAmpCache', () => {
  it('should extract HTTPS target from canonical host', () => {
    const url = new URL('https://cdn.ampproject.org/c/s/example.com/article')

    expect(unwrapAmpCache(url)).toBe('https://example.com/article')
  })

  it('should keep the target query string and fragment', () => {
    const url = new URL('https://cdn.ampproject.org/c/s/example.com/article.php?id=5#section')

    expect(unwrapAmpCache(url)).toBe('https://example.com/article.php?id=5#section')
  })

  it('should extract HTTPS target from publisher subdomain', () => {
    const url = new URL(
      'https://www-bbc-com.cdn.ampproject.org/c/s/www.bbc.com/news/amp/business-48879976',
    )

    expect(unwrapAmpCache(url)).toBe('https://www.bbc.com/news/amp/business-48879976')
  })

  it('should extract HTTP target when /s/ prefix is missing', () => {
    const url = new URL(
      'https://www-bbc-co-uk.cdn.ampproject.org/c/www.bbc.co.uk/news/amp/technology-40932487',
    )

    expect(unwrapAmpCache(url)).toBe('http://www.bbc.co.uk/news/amp/technology-40932487')
  })

  it('should return undefined for non-/c/ paths on the same host', () => {
    const imageUrl = new URL('https://cdn.ampproject.org/i/s/example.com/image.jpg')
    const videoUrl = new URL('https://cdn.ampproject.org/v/s/example.com/video.mp4')

    expect(unwrapAmpCache(imageUrl)).toBeUndefined()
    expect(unwrapAmpCache(videoUrl)).toBeUndefined()
  })

  it('should return undefined for non-AMP cache hosts', () => {
    const url = new URL('https://example.com/c/s/other.com/article')

    expect(unwrapAmpCache(url)).toBeUndefined()
  })
})
