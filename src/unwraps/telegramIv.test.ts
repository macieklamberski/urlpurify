import { describe, expect, it } from 'bun:test'
import { unwrapTelegramIv } from './telegramIv.js'

describe('unwrapTelegramIv', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://t.me/iv?url=https%3A%2F%2Fexample.com%2Farticle&rhash=abc123')
    const expected = 'https://example.com/article'

    expect(unwrapTelegramIv(value)).toBe(expected)
  })

  it('should return undefined for non-iv Telegram paths', () => {
    const value = new URL('https://t.me/channelname')

    expect(unwrapTelegramIv(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://t.me/iv?rhash=abc123')

    expect(unwrapTelegramIv(value)).toBeUndefined()
  })

  it('should return undefined for non-Telegram hosts', () => {
    const value = new URL('https://example.com/iv?url=https%3A%2F%2Fother.com')

    expect(unwrapTelegramIv(value)).toBeUndefined()
  })

  it('should return undefined for another Telegram path carrying a url param', () => {
    const value = new URL('https://t.me/channelname?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTelegramIv(value)).toBeUndefined()
  })
})
