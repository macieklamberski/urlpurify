import { describe, expect, it } from 'bun:test'
import { unwrapYandexTranslate } from './yandexTranslate.js'

describe('unwrapYandexTranslate', () => {
  it('should extract an https target', () => {
    const url = new URL('https://translated.turbopages.org/proxy_u/en-es.en/https/example.com/page')

    expect(unwrapYandexTranslate(url)).toBe('https://example.com/page')
  })

  it('should extract a target after a session token', () => {
    const url = new URL(
      'https://translated.turbopages.org/proxy_u/en-ru.ru.b4d9dd6a-66ff84ff-52b3eef8-74722d776562/https/en.wikipedia.org/wiki/Gnosticism',
    )

    expect(unwrapYandexTranslate(url)).toBe('https://en.wikipedia.org/wiki/Gnosticism')
  })

  it('should extract an http target when the scheme segment is missing', () => {
    const url = new URL(
      'https://translated.turbopages.org/proxy_u/ru-en.en.44506f2b-65c7e6e8-0bdcbce6-74722d776562/kremlin.ru/events/president/news/70565',
    )

    expect(unwrapYandexTranslate(url)).toBe('http://kremlin.ru/events/president/news/70565')
  })

  it('should keep the target query string and fragment', () => {
    const url = new URL(
      'https://translated.turbopages.org/proxy_u/en-es.en/https/example.com/page?id=5#section',
    )

    expect(unwrapYandexTranslate(url)).toBe('https://example.com/page?id=5#section')
  })

  it('should return undefined for other paths on the proxy host', () => {
    const url = new URL('https://translated.turbopages.org/about')

    expect(unwrapYandexTranslate(url)).toBeUndefined()
  })

  it('should return undefined when the proxy path has no target', () => {
    const url = new URL('https://translated.turbopages.org/proxy_u/en-es.en/')

    expect(unwrapYandexTranslate(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/proxy_u/en-es.en/https/example.com/page')

    expect(unwrapYandexTranslate(url)).toBeUndefined()
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://proxy.turbopages.org/proxy_u/en-es.en/https/example.com/page')

    expect(unwrapYandexTranslate(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampleturbopages.org/proxy_u/en-es.en/https/example.com/page')

    expect(unwrapYandexTranslate(url)).toBeUndefined()
  })
})
