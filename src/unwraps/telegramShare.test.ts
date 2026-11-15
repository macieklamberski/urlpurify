import { describe, expect, it } from 'bun:test'
import { unwrapTelegramShare } from './telegramShare.js'

const aliasHostUrls = [
  'https://www.t.me/share/url?url=https://example.com/post',
  'https://www.telegram.me/share/url?url=https://example.com/post',
  'https://telegram.dog/share/url?url=https://example.com/post',
  'https://www.telegram.dog/share/url?url=https://example.com/post',
]

describe('unwrapTelegramShare', () => {
  it('should extract a percent-encoded url from telegram.me/share/url', () => {
    const value = new URL(
      'https://telegram.me/share/url?url=https%3A%2F%2Fwww.example.com%2F%25d7%2594%25d7%259c%25d7%2591&text=%D7%94%D7%9C%D7%91',
    )
    const expected = 'https://www.example.com/%d7%94%d7%9c%d7%91'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should extract a raw url from t.me/share/url', () => {
    const value = new URL(
      'https://t.me/share/url?url=https://example.com/blog/samye-poddelyvaemye-tovary-v-rossii/',
    )
    const expected = 'https://example.com/blog/samye-poddelyvaemye-tovary-v-rossii/'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should extract a url from t.me/share', () => {
    const value = new URL(
      'https://t.me/share/?url=https%3A%2F%2Fwww.example.com%2F2024%2F10%2Fla-revolucion-de-la-inteligencia-artificial%2F&text=La+revoluci%C3%B3n',
    )
    const expected = 'https://www.example.com/2024/10/la-revolucion-de-la-inteligencia-artificial/'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should extract a url from a path with a trailing slash', () => {
    const value = new URL(
      'https://telegram.me/share/url/?url=https%3A%2F%2Fexample.com%2Fua%2Fukraine%2Fsuspilstvo%2F20250610-zaklykala',
    )
    const expected = 'https://example.com/ua/ukraine/suspilstvo/20250610-zaklykala'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should extract a url from share/link/add', () => {
    const value = new URL('http://www.telegram.me/share/link/add?url=https://blog.example.com')
    const expected = 'https://blog.example.com'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it.each(aliasHostUrls)('should extract a url from %s', (value) => {
    const expected = 'https://example.com/post'

    expect(unwrapTelegramShare(new URL(value))).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://t.me/Share/URL?url=https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL('https://t.me/share/url?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should extract url and ignore a url held in text', () => {
    const value = new URL(
      'https://t.me/share/url?text=https%3A%2F%2Fexample.org%2Fother&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTelegramShare(value)).toBe(expected)
  })

  it('should return undefined for a url held only in text', () => {
    const value = new URL('https://t.me/share/url?text=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapTelegramShare(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://t.me/share/url?url=&text=Hello')

    expect(unwrapTelegramShare(value)).toBeUndefined()
  })

  it('should return undefined for a channel link carrying a url', () => {
    const value = new URL('https://t.me/sharenews?url=https://example.com/post')

    expect(unwrapTelegramShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/share/url?url=https://example.org/post')

    expect(unwrapTelegramShare(value)).toBeUndefined()
  })
})
