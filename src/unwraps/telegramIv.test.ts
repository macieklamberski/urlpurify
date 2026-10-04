import { describe, expect, it } from 'bun:test'
import { unwrapTelegramIv } from './telegramIv.js'

describe('unwrapTelegramIv', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://t.me/iv?url=https%3A%2F%2Fexample.com%2Farticle&rhash=abc123')

    expect(unwrapTelegramIv(url)).toBe('https://example.com/article')
  })

  it('should return undefined for non-iv Telegram paths', () => {
    const url = new URL('https://t.me/channelname')

    expect(unwrapTelegramIv(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://t.me/iv?rhash=abc123')

    expect(unwrapTelegramIv(url)).toBeUndefined()
  })

  it('should return undefined for non-Telegram hosts', () => {
    const url = new URL('https://example.com/iv?url=https%3A%2F%2Fother.com')

    expect(unwrapTelegramIv(url)).toBeUndefined()
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://web.t.me/iv?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTelegramIv(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplet.me/iv?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTelegramIv(url)).toBeUndefined()
  })

  it('should return undefined for another Telegram path carrying a url param', () => {
    const url = new URL('https://t.me/channelname?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapTelegramIv(url)).toBeUndefined()
  })
})
