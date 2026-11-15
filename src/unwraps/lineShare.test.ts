import { describe, expect, it } from 'bun:test'
import { unwrapLineShare } from './lineShare.js'

describe('unwrapLineShare', () => {
  it('should extract the target from lineit/share', () => {
    const value = new URL(
      'https://social-plugins.line.me/lineit/share?url=https%3A%2F%2Fexample.com%2Fxvx-mu68fujiwave%2F31344%2F&text=XVX+MU68+FujiWave%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC',
    )
    const expected = 'https://example.com/xvx-mu68fujiwave/31344/'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should extract a raw target from lineit/share', () => {
    const value = new URL(
      'https://social-plugins.line.me/lineit/share?url=https://example.com/me/life-boring/',
    )
    const expected = 'https://example.com/me/life-boring/'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should read url over a text= placed before it', () => {
    const value = new URL(
      'https://social-plugins.line.me/lineit/share?text=6000%E5%99%B8%E8%91%A1%E8%90%84%E6%9E%9D&url=https%3A%2F%2Fexample.com%2Flife%2F3019924',
    )
    const expected = 'https://example.com/life/3019924'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should extract the target from lineit.line.me/share/ui', () => {
    const value = new URL(
      'https://lineit.line.me/share/ui?url=https%3A%2F%2Fexample.com%2Fnews%2Fart-4-%25e0%25b8%259b%25e0%25b8%25b5%2F',
    )
    const expected = 'https://example.com/news/art-4-%e0%b8%9b%e0%b8%b5/'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should extract the target from timeline.line.me/social-plugin/share', () => {
    const value = new URL(
      'https://timeline.line.me/social-plugin/share?url=https%3A%2F%2Fexample.com%2Farchives%2F3632',
    )
    const expected = 'https://example.com/archives/3632'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://social-plugins.line.me/lineit/share?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://social-plugins.line.me/LineIt/Share?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapLineShare(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://social-plugins.line.me/lineit/share?url=&text=Hello')

    expect(unwrapLineShare(value)).toBeUndefined()
  })

  it('should return undefined for a url carried only in text=', () => {
    const value = new URL('https://line.me/R/share?text=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapLineShare(value)).toBeUndefined()
  })

  it('should return undefined for the share button widget', () => {
    const value = new URL(
      'https://social-plugins.line.me/widget/share?url=https%3A%2F%2Fexample.com%2Fpost&buttonType=share-a',
    )

    expect(unwrapLineShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/lineit/share?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapLineShare(value)).toBeUndefined()
  })
})
