import { describe, expect, it } from 'bun:test'
import { unwrapGooglePlusShare } from './googlePlusShare.js'

describe('unwrapGooglePlusShare', () => {
  it('should extract a raw target', () => {
    const value = new URL(
      'http://plus.google.com/share?url=http://www.example.com/blog/default.cfm/2021/07/07/How-to-go-about-finding-out-what-kind-of-business-is-right-for-you',
    )
    const expected =
      'http://www.example.com/blog/default.cfm/2021/07/07/How-to-go-about-finding-out-what-kind-of-business-is-right-for-you'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://plus.google.com/share?url=http%3A%2F%2Fwww.example.com%2F2017%2F06%2F15%2Ffiliacao-ao-pt-de-elika-takimoto%2F',
    )
    const expected = 'http://www.example.com/2017/06/15/filiacao-ao-pt-de-elika-takimoto/'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL('https://plus.google.com/share?url=https%253A//example.com/node/2421')
    const expected = 'https://example.com/node/2421'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should extract the target after an hl param', () => {
    const value = new URL(
      'https://plus.google.com/share?hl=de&url=https://example.com/artikel/zwoelf-inspirierende-schweizer',
    )
    const expected = 'https://example.com/artikel/zwoelf-inspirierende-schweizer'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should extract the target on a numbered account path', () => {
    const value = new URL(
      'https://plus.google.com/u/0/share?url=http%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3DFZD8365q05E%26feature%3Dshare&source=yt',
    )
    const expected = 'http://www.example.com/watch?v=FZD8365q05E&feature=share'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://plus.google.com/Share?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapGooglePlusShare(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://plus.google.com/share?url=&hl=en')

    expect(unwrapGooglePlusShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://plus.google.com/url?sa=t&url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapGooglePlusShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/share?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapGooglePlusShare(value)).toBeUndefined()
  })
})
