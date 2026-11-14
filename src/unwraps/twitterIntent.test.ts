import { describe, expect, it } from 'bun:test'
import { unwrapTwitterIntent } from './twitterIntent.js'

describe('unwrapTwitterIntent', () => {
  it('should extract a percent-encoded url from /intent/tweet', () => {
    const value = new URL(
      'https://twitter.com/intent/tweet?text=Het%20bewind%20van%20Karel%20V%20en%20Filips%20II&url=https%3A%2F%2Fexample.com%2Fnieuwe-tijd%2Fkarel-v',
    )
    const expected = 'https://example.com/nieuwe-tijd/karel-v'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a raw url from x.com/intent/tweet', () => {
    const value = new URL(
      'https://x.com/intent/tweet?url=https://www.example.com/america-250-july-fourth&text=',
    )
    const expected = 'https://www.example.com/america-250-july-fourth'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from x.com/intent/post', () => {
    const value = new URL(
      'https://x.com/intent/post?text=%C4%B0ngiltere%20Ankara%20Anla%C5%9Fmas%C4%B1%202024&url=https%3A%2F%2Fexample.com%2Fingiltere-ankara-anlasmasi-2024%2F',
    )
    const expected = 'https://example.com/ingiltere-ankara-anlasmasi-2024/'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from twitter.com/share', () => {
    const value = new URL(
      'https://twitter.com/share?text=David+Lancy%27s+%27Raising+Children%27&via=CUPAcademic&related=CUPAcademic&url=http%3A%2F%2Fwww.example.org%2Fraising-children',
    )
    const expected = 'http://www.example.org/raising-children'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from x.com/share', () => {
    const value = new URL(
      'https://x.com/share?url=https://www.example.com/sv/nyheter/arets-byagarning/&text=Utm%C3%A4rkelsen',
    )
    const expected = 'https://www.example.com/sv/nyheter/arets-byagarning/'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from a www host', () => {
    const value = new URL('http://www.x.com/share?url=https://example.com/taxonomy/term/122/feed')
    const expected = 'https://example.com/taxonomy/term/122/feed'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from the mobile host', () => {
    const value = new URL('https://mobile.twitter.com/intent/tweet?url=https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should extract a url from a path with a trailing slash', () => {
    const value = new URL(
      'http://twitter.com/intent/tweet/?text=Checkerboard+-+pink+and+white&url=https%3A%2F%2Fexample.com%2Fcheckerboard-pink-and-white',
    )
    const expected = 'https://example.com/checkerboard-pink-and-white'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://twitter.com/Intent/Tweet?url=https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://twitter.com/intent/tweet?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTwitterIntent(value)).toBe(expected)
  })

  it('should return undefined for a url held only in text', () => {
    const value = new URL(
      'https://twitter.com/intent/tweet?text=https://example.com/differentiate-product-competition/',
    )

    expect(unwrapTwitterIntent(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://x.com/intent/tweet?url=&text=Hello')

    expect(unwrapTwitterIntent(value)).toBeUndefined()
  })

  it('should return undefined for another intent', () => {
    const value = new URL('https://twitter.com/intent/follow?screen_name=example')

    expect(unwrapTwitterIntent(value)).toBeUndefined()
  })

  it('should return undefined for a url on another path', () => {
    const value = new URL('https://twitter.com/home?status=https://example.com/post')

    expect(unwrapTwitterIntent(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/intent/tweet?url=https://example.org/post')

    expect(unwrapTwitterIntent(value)).toBeUndefined()
  })
})
