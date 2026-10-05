import { describe, expect, it } from 'bun:test'
import { unwrapNarrativ } from './narrativ.js'

describe('unwrapNarrativ', () => {
  it('should extract target from url param on narrativ.com', () => {
    const url = new URL(
      'https://narrativ.com/api/v0/client_redirect?url=https%3A%2F%2Fexample.com%2Fbuy',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/buy')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://narrativ.com/api/v0/client_redirect?other=value')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should return undefined for non-Narrativ hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should extract target from the redirect path', () => {
    const url = new URL(
      'https://events.release.narrativ.com/api/v0/redirect/?url=https%3A%2F%2Fexample.com%2Fpost&a=1750175743820128851',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/post')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://api.narrativ.com/api/v0/other?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should extract target from a shop-links.co link', () => {
    const url = new URL(
      'https://shop-links.co/link?skuId=6425015&publisher_slug=future&exclusive=1&u1=wp-us-9370859699835959296&url=https%3A%2F%2Fexample.com%2Fsite%2F6425015.p%3FskuId%3D6425015&article_url=https%3A%2F%2Fexample.org%2Fdeals%2F',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/site/6425015.p?skuId=6425015')
  })

  it('should extract target from a shop-links.co link with a trailing slash', () => {
    const url = new URL(
      'https://shop-links.co/link/?exclusive=1&publisher_slug=pocketlint&u1=UUplUeUpU38981&article_url=https%3A%2F%2Fexample.org%2Fdeals%2F&url=https%3A%2F%2Fexample.com%2Fdp%2FB0EXAMPLE',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/dp/B0EXAMPLE')
  })

  it('should extract an unencoded target from a howl.link link', () => {
    const url = new URL(
      'https://howl.link/link/?url=https://example.com/mac-studio/p/acz1cd00181&publisher_slug=macworld&exclusive=1&article_name=macworld',
    )

    expect(unwrapNarrativ(url)).toBe('https://example.com/mac-studio/p/acz1cd00181')
  })

  it('should return undefined for a Howl link without url', () => {
    const url = new URL(
      'https://howl.link/link/?article_name=Example&article_url=https%3A%2F%2Fexample.org%2Fdeals%2F',
    )

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should return undefined for another path on a Howl host', () => {
    const url = new URL('https://howl.link/w6napsbu971py?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })

  it('should return undefined for the link path on other hosts', () => {
    const url = new URL('https://example.com/link?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapNarrativ(url)).toBeUndefined()
  })
})
