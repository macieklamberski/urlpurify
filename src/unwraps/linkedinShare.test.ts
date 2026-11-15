import { describe, expect, it } from 'bun:test'
import { unwrapLinkedinShare } from './linkedinShare.js'

describe('unwrapLinkedinShare', () => {
  it('should extract the target from shareArticle', () => {
    const value = new URL(
      'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fexample.com%2Fnieuws%2Fhet-bewind-van-karel-v-en-filips-ii-een-groot-contrast&title=Het%20bewind',
    )
    const expected =
      'https://example.com/nieuws/het-bewind-van-karel-v-en-filips-ii-een-groot-contrast'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract a raw target from shareArticle on linkedin.com', () => {
    const value = new URL(
      'https://linkedin.com/shareArticle?mini=true&title=Private%20Messages%20Exposed&url=https://www.example.com/private-messages-exposed/',
    )
    const expected = 'https://www.example.com/private-messages-exposed/'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract the target from shareArticle with a trailing slash', () => {
    const value = new URL(
      'http://www.linkedin.com/shareArticle/?mini=true&url=https%3A%2F%2Fwww.example.com%2F2023%2F05%2Fexpiration-of-covid-19-travel-restrictions%2F&title=Expiration+of+COVID-19+Travel+Restrictions',
    )
    const expected = 'https://www.example.com/2023/05/expiration-of-covid-19-travel-restrictions/'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract the target from sharing/share-offsite', () => {
    const value = new URL(
      'https://www.linkedin.com/sharing/share-offsite/?url=https://www.example.com/video/blackouts-durch-erneuerbare-skandal-um-die-braunkohlefolgekosten',
    )
    const expected =
      'https://www.example.com/video/blackouts-durch-erneuerbare-skandal-um-die-braunkohlefolgekosten'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract a half-encoded target from sharing/share-offsite without a trailing slash', () => {
    const value = new URL(
      'https://www.linkedin.com/sharing/share-offsite?url=https%3A//www.example.com/taxonomy/term/1052/feed%3Fa%3Db',
    )
    const expected = 'https://www.example.com/taxonomy/term/1052/feed?a=b'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract the target from cws/share', () => {
    const value = new URL(
      'https://www.linkedin.com/cws/share?url=http://www.example.com/2020/04/trust-in-financial-planning/',
    )
    const expected = 'http://www.example.com/2020/04/trust-in-financial-planning/'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract the target from cws/share with a trailing slash', () => {
    const value = new URL(
      'https://www.linkedin.com/cws/share/?url=https%3A%2F%2Fexample.com%2Fep73-melissa-troupe-mocha-whip%2F',
    )
    const expected = 'https://example.com/ep73-melissa-troupe-mocha-whip/'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract the target from the legacy share path', () => {
    const value = new URL(
      'http://www.linkedin.com/share?viewLink=&sid=s5818650416275427335&url=http%3A%2F%2Fwww%2Eexample%2Ecom%2Fslideshow%2Fembed_code%2F29279831&urlhash=nQdY',
    )
    const expected = 'http://www.example.com/slideshow/embed_code/29279831'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://www.linkedin.com/shareArticle?mini=true&url=http%253A//www.example.com/node/2431',
    )
    const expected = 'http://www.example.com/node/2431'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should read url over a source holding a url', () => {
    const value = new URL(
      'https://www.linkedin.com/sharing/share-offsite?source=https://www.example.org/&url=https://www.example.com/business-school/taxonomy/term/1119/feed&title=',
    )
    const expected = 'https://www.example.com/business-school/taxonomy/term/1119/feed'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.linkedin.com/sharearticle?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapLinkedinShare(value)).toBe(expected)
  })

  it('should return undefined when only source holds a url', () => {
    const value = new URL(
      'https://www.linkedin.com/shareArticle?mini=true&title=Post&source=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedinShare(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.linkedin.com/shareArticle?mini=true&url=&title=Post')

    expect(unwrapLinkedinShare(value)).toBeUndefined()
  })

  it('should return undefined for the learning sign-in share page', () => {
    // The url= is constructed: no learning-login link in the walk carries it.
    const value = new URL(
      'https://www.linkedin.com/learning-login/share?forceAccount=false&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2Finterview-master-class&url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapLinkedinShare(value)).toBeUndefined()
  })

  it('should return undefined for a longer path starting with share', () => {
    const value = new URL(
      'https://www.linkedin.com/sharer/sharer.php?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapLinkedinShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/shareArticle?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapLinkedinShare(value)).toBeUndefined()
  })
})
