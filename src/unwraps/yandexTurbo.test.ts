import { describe, expect, it } from 'bun:test'
import { unwrapYandexTurbo } from './yandexTurbo.js'

describe('unwrapYandexTurbo', () => {
  it('should reconstruct source URL from subdomain and path', () => {
    const url = new URL('https://example-com.turbopages.org/example.com/s/article/2024/01/hello')

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/article/2024/01/hello')
  })

  it('should restore dotted source hosts from dashed subdomains', () => {
    const url = new URL('https://news-example-com.turbopages.org/news.example.com/s/path')

    expect(unwrapYandexTurbo(url)).toBe('https://news.example.com/path')
  })

  it('should extract target from text param on the yandex.ru Turbo view', () => {
    const url = new URL(
      'https://yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2Fworld%2F2019%2F11%2F21%2F1009533.html&promo=navbar&utm_referrer=https%3A%2F%2Fzen.yandex.com%2F%3Ffrom%3Dspecial&utm_source=YandexZenSpecial',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/world/2019/11/21/1009533.html')
  })

  it('should extract target from text param on www.yandex.ru', () => {
    const url = new URL(
      'https://www.yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2Ferror-c1900101%2F',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/error-c1900101/')
  })

  it('should extract target from text param on yandex.by', () => {
    const url = new URL(
      'https://yandex.by/turbo?text=https%3A%2F%2Fexample.com%2Fblok%2Fpered_sudom%2F',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/blok/pered_sudom/')
  })

  it('should keep the target query when text param holds it encoded', () => {
    const url = new URL(
      'https://yandex.ru/turbo?text=http%3A%2F%2Fexample.com%2F%3Fp%3D42&from=webmaster',
    )

    expect(unwrapYandexTurbo(url)).toBe('http://example.com/?p=42')
  })

  it('should return undefined when text param is missing', () => {
    const url = new URL('https://yandex.ru/turbo?promo=navbar')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the host-in-path shape on yandex.ru', () => {
    const url = new URL('https://yandex.ru/turbo/example.com/s/2020-09-17/article?promo=navbar')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for text param on the yandex.ru search path', () => {
    const url = new URL('https://yandex.ru/search/?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a lookalike host', () => {
    const url = new URL('https://exampleyandex.ru/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined when path lacks the /s/ marker', () => {
    const url = new URL('https://example-com.turbopages.org/example.com/no-marker/path')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for non-turbopages hosts', () => {
    const url = new URL('https://example.com/host/s/path')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a host that extends yandex.ru', () => {
    const url = new URL('https://yandex.ru.example.com/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })
})
