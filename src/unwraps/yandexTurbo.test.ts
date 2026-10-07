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

  it('should extract the host from the path on yandex.ru', () => {
    const url = new URL('https://yandex.ru/turbo/example.com/s/society/2020/12/21/1076391.html')

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/society/2020/12/21/1076391.html')
  })

  it('should extract the host from the path on turbopages.org', () => {
    const url = new URL(
      'https://example-com.turbopages.org/turbo/example.com/s/news/society/2020/alliance_id2020/',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/news/society/2020/alliance_id2020/')
  })

  it('should drop the Turbo query when the host is in the path', () => {
    const url = new URL(
      'https://yandex.ru/turbo/example.com/s/world/2021/7/2/1106993.html?utm_source=yxnews&utm_medium=desktop',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/world/2021/7/2/1106993.html')
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

  it('should extract target from text param on yandex.com', () => {
    const url = new URL('https://yandex.com/turbo?text=https%3A%2F%2Fexample.com%2Fnews%2F')

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/news/')
  })

  it('should extract target from text param on yandex.com.tr', () => {
    const url = new URL('https://yandex.com.tr/turbo?text=https%3A%2F%2Fexample.com%2Fhaber%2F')

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/haber/')
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

  it('should return undefined for the host in the path without the /s/ marker', () => {
    const url = new URL('https://yandex.ru/turbo/example.com/news/1106993.html')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the host in the path with no source path', () => {
    const url = new URL('https://yandex.ru/turbo/example.com/s/')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the host in the path on a lookalike host', () => {
    const url = new URL('https://exampleyandex.ru/turbo/example.com/s/news/1106993.html')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should extract the target of a Yandex Turbo page with /s/ before the host', () => {
    const url = new URL(
      'https://yandex.ru/turbo/s/example.com/news/1106993.html?parent-reqid=1652314211633181',
    )

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/news/1106993.html')
  })

  it('should extract the target of a turbopages.org page with /s/ before the host', () => {
    const url = new URL('https://example-com.turbopages.org/s/example.com/article/053551fc')

    expect(unwrapYandexTurbo(url)).toBe('https://example.com/article/053551fc')
  })

  it('should return undefined for /s/ before the host on Yandex without /turbo', () => {
    const url = new URL('https://yandex.ru/news/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for /s/ at the root on Yandex', () => {
    const url = new URL('https://yandex.ru/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for /turbo/s/ under another path on Yandex', () => {
    const url = new URL('https://yandex.ru/news/turbo/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on another Yandex subdomain', () => {
    const url = new URL('https://mail.yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2F')

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

  it('should return undefined for the Turbo view on a top-level domain longer than three letters', () => {
    const url = new URL('https://yandex.abcd/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a host that extends yandex.ru', () => {
    const url = new URL('https://yandex.ru.example.com/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(url)).toBeUndefined()
  })
})
