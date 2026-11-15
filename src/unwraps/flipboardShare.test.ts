import { describe, expect, it } from 'bun:test'
import { unwrapFlipboardShare } from './flipboardShare.js'

describe('unwrapFlipboardShare', () => {
  it('should extract a percent-encoded url', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout?v=2&title=The%20Architecture%20of%20Japanese%20Shrines%20and%20Temples&url=https%3A%2F%2Fexample.com%2Fen%2Fin-tokyo%2Fin-pref-tokyo%2Fin-tokyo_train_station%2Farticle-a0000271%2F',
    )
    const expected =
      'https://example.com/en/in-tokyo/in-pref-tokyo/in-tokyo_train_station/article-a0000271/'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should extract a raw url', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout?v=2&url=https://www.example.com/music/music-news/americas-got-talent-winner-michael-grimm-recovery-no-singing-v',
    )
    const expected =
      'https://www.example.com/music/music-news/americas-got-talent-winner-michael-grimm-recovery-no-singing-v'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should extract a url when v holds a title', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout?v=The+Ocean+Teems+With+Networks+of+Interconnected+Bacteria&url=https://www.example.com/the-ocean-teems-with-networks-of-interconnected-bacteria-20250106/',
    )
    const expected =
      'https://www.example.com/the-ocean-teems-with-networks-of-interconnected-bacteria-20250106/'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should extract a url from the www host', () => {
    const value = new URL(
      'https://www.flipboard.com/bookmarklet/popout?title=Almendrados%20(Flourless%20Almond%20Cookies)%20&url=https://www.example.com/recipe/almendrados-almond-cookies%3Futm_source=flipboard.com&utm_medium=referral&v=2',
    )
    const expected =
      'https://www.example.com/recipe/almendrados-almond-cookies?utm_source=flipboard.com'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should extract a url from the bare host', () => {
    const value = new URL(
      'https://flipboard.com/bookmarklet/popout?v=2&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should extract a url from the path with a trailing slash', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout/?v=2&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://share.flipboard.com/Bookmarklet/Popout?url=https://example.com/post',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout?v=2&url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlipboardShare(value)).toBe(expected)
  })

  it('should return undefined for a url held only in title', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet/popout?v=2&title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapFlipboardShare(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://share.flipboard.com/bookmarklet/popout?v=2&url=&title=Hello')

    expect(unwrapFlipboardShare(value)).toBeUndefined()
  })

  it('should return undefined for a url on another path', () => {
    const value = new URL(
      'https://share.flipboard.com/bookmarklet?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapFlipboardShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://example.com/bookmarklet/popout?v=2&url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapFlipboardShare(value)).toBeUndefined()
  })
})
