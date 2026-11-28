import { describe, expect, it } from 'bun:test'
import { unwrapAmpCache } from './ampCache.js'

describe('unwrapAmpCache', () => {
  it('should extract HTTPS target from canonical host', () => {
    const value = new URL('https://cdn.ampproject.org/c/s/example.com/article')
    const expected = 'https://example.com/article'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should keep the target query string and fragment', () => {
    const value = new URL('https://cdn.ampproject.org/c/s/example.com/article.php?id=5#section')
    const expected = 'https://example.com/article.php?id=5#section'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should extract HTTPS target from publisher subdomain', () => {
    const value = new URL(
      'https://www-bbc-com.cdn.ampproject.org/c/s/www.bbc.com/news/amp/business-48879976',
    )
    const expected = 'https://www.bbc.com/news/amp/business-48879976'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should extract HTTP target when /s/ prefix is missing', () => {
    const value = new URL(
      'https://www-bbc-co-uk.cdn.ampproject.org/c/www.bbc.co.uk/news/amp/technology-40932487',
    )
    const expected = 'http://www.bbc.co.uk/news/amp/technology-40932487'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should extract HTTPS target from a viewer path', () => {
    const value = new URL(
      'https://www-example-com.cdn.ampproject.org/v/s/www.example.com/mundo/noticias-51499612.amp?amp_js_v=a6&amp_gsa=1',
    )
    const expected = 'https://www.example.com/mundo/noticias-51499612.amp'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should extract HTTP target from a viewer path without /s/', () => {
    const value = new URL(
      'https://example-com.cdn.ampproject.org/v/example.com/news/123.amp?amp_js_v=0.1',
    )
    const expected = 'http://example.com/news/123.amp'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should drop the usqp experiment param', () => {
    const value = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/article/amp/?usqp=mq331AQOCAGYAZW9-eX-mPj1iAE=',
    )
    const expected = 'https://example.com/article/amp/'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should keep the target query params next to the viewer params', () => {
    const value = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/story?outputType=amp&amp_js_v=a6&amp_gsa=1',
    )
    const expected = 'https://example.com/story?outputType=amp'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should drop the viewer init params in the fragment', () => {
    const value = new URL(
      'https://example-com.cdn.ampproject.org/v/s/example.com/story.amp?amp_js_v=a6#aoh=16199813836874&referrer=https://www.google.com&amp_tf=From',
    )
    const expected = 'https://example.com/story.amp'

    expect(unwrapAmpCache(value)).toBe(expected)
  })

  it('should return undefined for an image path on the same host', () => {
    const value = new URL('https://cdn.ampproject.org/i/s/example.com/image.jpg')

    expect(unwrapAmpCache(value)).toBeUndefined()
  })

  it('should return undefined for non-AMP cache hosts', () => {
    const value = new URL('https://example.com/c/s/example.org/article')

    expect(unwrapAmpCache(value)).toBeUndefined()
  })
})
