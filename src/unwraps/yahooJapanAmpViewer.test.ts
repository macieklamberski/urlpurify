import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapYahooJapanAmpViewer } from './yahooJapanAmpViewer.js'

describe('unwrapYahooJapanAmpViewer', () => {
  it('should drop a space before the target host', () => {
    const value = 'https://search.yahoo.co.jp/amp/s/%20www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapYahooJapanAmpViewer] })).toBe(expected)
  })

  it('should extract an https target with its encoded query', () => {
    const value = new URL(
      'https://search.yahoo.co.jp/amp/s/example.com/amp/movie/92154/%3Fusqp%3Dmq331AQIKAGwASCAAgM%253D',
    )
    const expected = 'https://example.com/amp/movie/92154/?usqp=mq331AQIKAGwASCAAgM%3D'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })

  it('should extract an http target with its encoded query', () => {
    const value = new URL(
      'https://search.yahoo.co.jp/amp/example.com/article/390127929.html%3Famp%3D1%26usqp%3Dmq331AQGCAEoAVgB',
    )
    const expected = 'http://example.com/article/390127929.html?amp=1&usqp=mq331AQGCAEoAVgB'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })

  it('should extract a target without a query', () => {
    const value = new URL('https://search.yahoo.co.jp/amp/s/example.com/news/308550')
    const expected = 'https://example.com/news/308550'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })

  it('should keep a query on the viewer url', () => {
    const value = new URL(
      'https://search.yahoo.co.jp/amp/s/example.com/news/308550?ref=example.org',
    )
    const expected = 'https://example.com/news/308550?ref=example.org'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })

  it('should keep an escape cut short in the target as written', () => {
    const value = new URL('https://search.yahoo.co.jp/amp/s/example.com/amp/movie/92154/%3')
    const expected = 'https://example.com/amp/movie/92154/%3'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })

  it('should keep the wrapper for a target host that does not parse', () => {
    const value = 'https://search.yahoo.co.jp/amp/s/example.com%25/news/308550'

    expect(purifyUrl(value, { unwrappers: [unwrapYahooJapanAmpViewer] })).toBe(value)
  })

  it('should return undefined for the bare viewer path', () => {
    const value = new URL('https://search.yahoo.co.jp/amp/')

    expect(unwrapYahooJapanAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://search.yahoo.co.jp/search?p=example.com/amp/s/example.com')

    expect(unwrapYahooJapanAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for an https viewer path below another path', () => {
    const value = new URL('https://search.yahoo.co.jp/search/amp/s/example.com/news/308550')

    expect(unwrapYahooJapanAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for an http viewer path below another path', () => {
    const value = new URL('https://search.yahoo.co.jp/search/amp/example.com/news/308550')

    expect(unwrapYahooJapanAmpViewer(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/amp/s/example.org/news/308550')

    expect(unwrapYahooJapanAmpViewer(value)).toBeUndefined()
  })

  it('should drop the viewer fragment', () => {
    const value = new URL(
      'https://search.yahoo.co.jp/amp/s/example.com/news/308550#aoh=17000000000000&amp_tf=From',
    )
    const expected = 'https://example.com/news/308550'

    expect(unwrapYahooJapanAmpViewer(value)).toBe(expected)
  })
})
