import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapYandexTurbo } from './yandexTurbo.js'

describe('unwrapYandexTurbo', () => {
  it('should reconstruct source URL from subdomain and path', () => {
    const value = new URL('https://example-com.turbopages.org/example.com/s/article/2024/01/hello')
    const expected = 'https://example.com/article/2024/01/hello'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should restore dotted source hosts from dashed subdomains', () => {
    const value = new URL('https://news-example-com.turbopages.org/news.example.com/s/path')
    const expected = 'https://news.example.com/path'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract the host from the path on yandex.ru', () => {
    const value = new URL('https://yandex.ru/turbo/example.com/s/society/2020/12/21/1076391.html')
    const expected = 'https://example.com/society/2020/12/21/1076391.html'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract the host from the path on turbopages.org', () => {
    const value = new URL(
      'https://example-com.turbopages.org/turbo/example.com/s/news/society/2020/alliance_id2020/',
    )
    const expected = 'https://example.com/news/society/2020/alliance_id2020/'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should drop the Turbo query when the host is in the path', () => {
    const value = new URL(
      'https://yandex.ru/turbo/example.com/s/world/2021/7/2/1106993.html?utm_source=yxnews&utm_medium=desktop',
    )
    const expected = 'https://example.com/world/2021/7/2/1106993.html'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract target from text param on the yandex.ru Turbo view', () => {
    const value = new URL(
      'https://yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2Fworld%2F2019%2F11%2F21%2F1009533.html&promo=navbar&utm_referrer=https%3A%2F%2Fzen.yandex.com%2F%3Ffrom%3Dspecial&utm_source=YandexZenSpecial',
    )
    const expected = 'https://example.com/world/2019/11/21/1009533.html'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract target from text param on www.yandex.ru', () => {
    const value = new URL(
      'https://www.yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2Ferror-c1900101%2F',
    )
    const expected = 'https://example.com/error-c1900101/'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract target from text param on yandex.by', () => {
    const value = new URL(
      'https://yandex.by/turbo?text=https%3A%2F%2Fexample.com%2Fblok%2Fpered_sudom%2F',
    )
    const expected = 'https://example.com/blok/pered_sudom/'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract target from text param on yandex.com', () => {
    const value = new URL('https://yandex.com/turbo?text=https%3A%2F%2Fexample.com%2Fnews%2F')
    const expected = 'https://example.com/news/'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract target from text param on yandex.com.tr', () => {
    const value = new URL('https://yandex.com.tr/turbo?text=https%3A%2F%2Fexample.com%2Fhaber%2F')
    const expected = 'https://example.com/haber/'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should keep the target query when text param holds it encoded', () => {
    const value = new URL(
      'https://yandex.ru/turbo?text=http%3A%2F%2Fexample.com%2F%3Fp%3D42&from=webmaster',
    )
    const expected = 'http://example.com/?p=42'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should return undefined when text param is missing', () => {
    const value = new URL('https://yandex.ru/turbo?promo=navbar')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the host in the path without the /s/ marker', () => {
    const value = new URL('https://yandex.ru/turbo/example.com/news/1106993.html')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the host in the path with no source path', () => {
    const value = new URL('https://yandex.ru/turbo/example.com/s/')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the host in the path on a lookalike host', () => {
    const value = new URL('https://exampleyandex.ru/turbo/example.com/s/news/1106993.html')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should extract the target of a Yandex Turbo page with /s/ before the host', () => {
    const value = new URL(
      'https://yandex.ru/turbo/s/example.com/news/1106993.html?parent-reqid=1652314211633181',
    )
    const expected = 'https://example.com/news/1106993.html'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should extract the target of a turbopages.org page with /s/ before the host', () => {
    const value = new URL('https://example-com.turbopages.org/s/example.com/article/053551fc')
    const expected = 'https://example.com/article/053551fc'

    expect(unwrapYandexTurbo(value)).toBe(expected)
  })

  it('should return undefined for /s/ before the host on Yandex without /turbo', () => {
    const value = new URL('https://yandex.ru/news/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for /s/ at the root on Yandex', () => {
    const value = new URL('https://yandex.ru/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for /turbo/s/ under another path on Yandex', () => {
    const value = new URL('https://yandex.ru/news/turbo/s/example.com/1106993.html')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on another Yandex subdomain', () => {
    const value = new URL('https://mail.yandex.ru/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for text param on the yandex.ru search path', () => {
    const value = new URL('https://yandex.ru/search/?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a lookalike host', () => {
    const value = new URL('https://exampleyandex.ru/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined when path lacks the /s/ marker', () => {
    const value = new URL('https://example-com.turbopages.org/example.com/no-marker/path')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for non-turbopages hosts', () => {
    const value = new URL('https://example.com/host/s/path')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a top-level domain longer than three letters', () => {
    const value = new URL('https://yandex.abcd/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a host that extends yandex.ru', () => {
    const value = new URL('https://yandex.ru.example.com/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should return undefined for the Turbo view on a turbopages.org host', () => {
    const value = new URL('https://yandex.turbopages.org/turbo?text=https%3A%2F%2Fexample.com%2F')

    expect(unwrapYandexTurbo(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapYandexTurbo)).toBe(true)
  })
})
