import { describe, expect, it } from 'bun:test'
import { unwrapStumbleupon } from './stumbleupon.js'

describe('unwrapStumbleupon', () => {
  it('should extract the target after the url id', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/5Fv5LG/example.blogspot.com/2010/06/tropical-traditions-coconut-oil.html',
    )
    const expected = 'http://example.blogspot.com/2010/06/tropical-traditions-coconut-oil.html'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should extract the target after the url id and token', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/1qAEqM/:PAQwq8Ek:OGhSgMT_/www.example.co.uk/lifeandstyle/2013/may/04/i-was-swallowed-by-a-hippo/',
    )
    const expected = 'http://www.example.co.uk/lifeandstyle/2013/may/04/i-was-swallowed-by-a-hippo/'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should extract the target after a token holding a dot', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/AQYh0n/yWK.nIM5:bhSTulHA/example.com/2012/01/3-clever-diy-super-bowl-party-decorations/',
    )
    const expected = 'http://example.com/2012/01/3-clever-diy-super-bowl-party-decorations/'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/AqwMZF/www.example.com/post/deepwater-horizon-index/?utm_source=supr#top',
    )
    const expected = 'http://www.example.com/post/deepwater-horizon-index/?utm_source=supr#top'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should drop the trailing StumbleUpon marker', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/20lz0A/example.com/place/hereford-mappa-mundi/r:t',
    )
    const expected = 'http://example.com/place/hereford-mappa-mundi'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should return undefined for a numeric id', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/106331973/www.example.com/2012/02/here-take-all-my-money.html',
    )

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for a target that keeps its scheme', () => {
    const value = new URL(
      'http://www.stumbleupon.com/su/5Fv5LG/http://example.com/2010/06/page.html',
    )

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for an id with no target', () => {
    const value = new URL('http://www.stumbleupon.com/su/15fyi1')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for the url info page', () => {
    const value = new URL('http://www.stumbleupon.com/url/example.com/2010/06/page.html')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('http://example.com/su/5Fv5LG/example.org/2010/06/page.html')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for an id holding a punctuation mark', () => {
    const value = new URL('http://www.stumbleupon.com/su/5Fv.LG/example.com/2010/06/page.html')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should extract the target of the app promo redirect', () => {
    const value = new URL(
      'http://www.stumbleupon.com/to/event/redir/?url=http://itunes.apple.com/us/app/stumbleupon/id386244833&source=suMobile',
    )
    const expected = 'http://itunes.apple.com/us/app/stumbleupon/id386244833'

    expect(unwrapStumbleupon(value)).toBe(expected)
  })

  it('should return undefined for the app promo redirect with no target', () => {
    const value = new URL('http://www.stumbleupon.com/to/event/redir/?source=suMobile')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })

  it('should return undefined for another event path on the host', () => {
    const value = new URL('http://www.stumbleupon.com/to/event/login/?url=http://example.com/')

    expect(unwrapStumbleupon(value)).toBeUndefined()
  })
})
