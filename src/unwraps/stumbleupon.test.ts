import { describe, expect, it } from 'bun:test'
import { unwrapStumbleupon } from './stumbleupon.js'

describe('unwrapStumbleupon', () => {
  it('should extract the target after the url id', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/5Fv5LG/example.blogspot.com/2010/06/tropical-traditions-coconut-oil.html',
    )

    expect(unwrapStumbleupon(url)).toBe(
      'http://example.blogspot.com/2010/06/tropical-traditions-coconut-oil.html',
    )
  })

  it('should extract the target after the url id and token', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/1qAEqM/:PAQwq8Ek:OGhSgMT_/www.example.co.uk/lifeandstyle/2013/may/04/i-was-swallowed-by-a-hippo/',
    )

    expect(unwrapStumbleupon(url)).toBe(
      'http://www.example.co.uk/lifeandstyle/2013/may/04/i-was-swallowed-by-a-hippo/',
    )
  })

  it('should extract the target after a token holding a dot', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/AQYh0n/yWK.nIM5:bhSTulHA/example.com/2012/01/3-clever-diy-super-bowl-party-decorations/',
    )

    expect(unwrapStumbleupon(url)).toBe(
      'http://example.com/2012/01/3-clever-diy-super-bowl-party-decorations/',
    )
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/AqwMZF/www.example.com/post/deepwater-horizon-index/?utm_source=supr#top',
    )

    expect(unwrapStumbleupon(url)).toBe(
      'http://www.example.com/post/deepwater-horizon-index/?utm_source=supr#top',
    )
  })

  it('should drop the trailing StumbleUpon marker', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/20lz0A/example.com/place/hereford-mappa-mundi/r:t',
    )

    expect(unwrapStumbleupon(url)).toBe('http://example.com/place/hereford-mappa-mundi')
  })

  it('should return undefined for a numeric id', () => {
    const url = new URL(
      'http://www.stumbleupon.com/su/106331973/www.example.com/2012/02/here-take-all-my-money.html',
    )

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for a target that keeps its scheme', () => {
    const url = new URL('http://www.stumbleupon.com/su/5Fv5LG/http://example.com/2010/06/page.html')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for an id with no target', () => {
    const url = new URL('http://www.stumbleupon.com/su/15fyi1')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for the url info page', () => {
    const url = new URL('http://www.stumbleupon.com/url/example.com/2010/06/page.html')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://example.com/su/5Fv5LG/example.org/2010/06/page.html')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for an id holding a punctuation mark', () => {
    const url = new URL('http://www.stumbleupon.com/su/5Fv.LG/example.com/2010/06/page.html')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should extract the target of the app promo redirect', () => {
    const url = new URL(
      'http://www.stumbleupon.com/to/event/redir/?url=http://itunes.apple.com/us/app/stumbleupon/id386244833&source=suMobile',
    )

    expect(unwrapStumbleupon(url)).toBe('http://itunes.apple.com/us/app/stumbleupon/id386244833')
  })

  it('should return undefined for the app promo redirect with no target', () => {
    const url = new URL('http://www.stumbleupon.com/to/event/redir/?source=suMobile')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })

  it('should return undefined for another event path on the host', () => {
    const url = new URL('http://www.stumbleupon.com/to/event/login/?url=http://example.com/')

    expect(unwrapStumbleupon(url)).toBeUndefined()
  })
})
