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

  it('should extract HTTPS target from a viewer path', () => {
    const url = new URL(
      'https://www-example-com.cdn.ampproject.org/v/s/www.example.com/mundo/noticias-51499612.amp?amp_js_v=a6&amp_gsa=1',
    )

    expect(unwrapAmpCache(url)).toBe('https://www.example.com/mundo/noticias-51499612.amp')
  })

  it('should extract HTTP target from a viewer path without /s/', () => {
    const url = new URL(
      'https://example-com.cdn.ampproject.org/v/example.com/news/123.amp?amp_js_v=0.1',
    )

    expect(unwrapAmpCache(url)).toBe('http://example.com/news/123.amp')
  })

  it('should drop the usqp experiment param', () => {
    const url = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/article/amp/?usqp=mq331AQOCAGYAZW9-eX-mPj1iAE=',
    )

    expect(unwrapAmpCache(url)).toBe('https://example.com/article/amp/')
  })

  it('should keep the target query params next to the viewer params', () => {
    const url = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/story?outputType=amp&amp_js_v=a6&amp_gsa=1',
    )

    expect(unwrapAmpCache(url)).toBe('https://example.com/story?outputType=amp')
  })

  it('should drop the viewer init params in the fragment', () => {
    const url = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/story.amp?amp_js_v=a6#aoh=16199813836874&referrer=https://www.google.com&amp_tf=From',
    )

    expect(unwrapAmpCache(url)).toBe('https://example.com/story.amp')
  })

  it('should return undefined for an image path on the same host', () => {
    const url = new URL('https://cdn.ampproject.org/i/s/example.com/image.jpg')

    expect(unwrapAmpCache(url)).toBeUndefined()
  })

  it('should return undefined for non-AMP cache hosts', () => {
    const url = new URL('https://example.com/c/s/example.org/article')

    expect(unwrapAmpCache(url)).toBeUndefined()
  })
})
