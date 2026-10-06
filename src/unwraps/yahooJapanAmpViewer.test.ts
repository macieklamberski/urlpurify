import { describe, expect, it } from 'bun:test'
import { unwrapYahooJapanAmpViewer } from './yahooJapanAmpViewer.js'

describe('unwrapYahooJapanAmpViewer', () => {
  it('should extract an https target with its encoded query', () => {
    const url = new URL(
      'https://search.yahoo.co.jp/amp/s/example.com/amp/movie/92154/%3Fusqp%3Dmq331AQIKAGwASCAAgM%253D',
    )

    expect(unwrapYahooJapanAmpViewer(url)).toBe(
      'https://example.com/amp/movie/92154/?usqp=mq331AQIKAGwASCAAgM%3D',
    )
  })

  it('should extract an http target with its encoded query', () => {
    const url = new URL(
      'https://search.yahoo.co.jp/amp/example.com/article/390127929.html%3Famp%3D1%26usqp%3Dmq331AQGCAEoAVgB',
    )

    expect(unwrapYahooJapanAmpViewer(url)).toBe(
      'http://example.com/article/390127929.html?amp=1&usqp=mq331AQGCAEoAVgB',
    )
  })

  it('should extract a target without a query', () => {
    const url = new URL('https://search.yahoo.co.jp/amp/s/example.com/news/308550')

    expect(unwrapYahooJapanAmpViewer(url)).toBe('https://example.com/news/308550')
  })

  it('should return undefined for a target cut short inside an escape', () => {
    const url = new URL('https://search.yahoo.co.jp/amp/s/example.com/amp/movie/92154/%3')

    expect(unwrapYahooJapanAmpViewer(url)).toBeUndefined()
  })

  it('should return undefined for a target host that does not parse', () => {
    const url = new URL('https://search.yahoo.co.jp/amp/s/example.com%25/news/308550')

    expect(unwrapYahooJapanAmpViewer(url)).toBeUndefined()
  })

  it('should return undefined for the bare viewer path', () => {
    const url = new URL('https://search.yahoo.co.jp/amp/')

    expect(unwrapYahooJapanAmpViewer(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://search.yahoo.co.jp/search?p=example.com/amp/s/example.com')

    expect(unwrapYahooJapanAmpViewer(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/amp/s/example.org/news/308550')

    expect(unwrapYahooJapanAmpViewer(url)).toBeUndefined()
  })
})
