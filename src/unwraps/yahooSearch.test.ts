import { describe, expect, it } from 'bun:test'
import { unwrapYahooSearch } from './yahooSearch.js'

describe('unwrapYahooSearch', () => {
  it('should extract target from RU path segment', () => {
    const value = new URL(
      'https://r.search.yahoo.com/_ylt=AAA/SIG=BBB/EXP=CCC/RU=https%3A%2F%2Fexample.com%2Farticle/RK=2/RS=DDD-',
    )
    const expected = 'https://example.com/article'

    expect(unwrapYahooSearch(value)).toBe(expected)
  })

  it('should extract unencoded target from RU path segment', () => {
    const value = new URL(
      'https://r.search.yahoo.com/_ylt=AwrJ6SUKtuNeVsAAXDhXNyoA;_ylu=X3oDMTEyOGI4bGNnBGNvbG8DYmYxBHBvcwMxBHZ0aWQDQjg3NDZfMQRzZWMDc3I-/RV=2/RE=1592010379/RO=10/RU=https://www.example.com/en/main.html/RK=2/RS=h9cMUNkezgC.X6SqpQKt',
    )
    const expected = 'https://www.example.com/en/main.html'

    expect(unwrapYahooSearch(value)).toBe(expected)
  })

  it('should keep the trailing slash of an unencoded target before RK=', () => {
    const value = new URL(
      'https://r.search.yahoo.com/_ylt=AwrEqavrkc1pMgIAU8dXNyoA;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3Ny/RV=2/RE=1776289515/RO=10/RU=https://example.org//RK=2/RS=q1ph58zOQdFBKJeNiGTkymv7Dio-',
    )
    const expected = 'https://example.org/'

    expect(unwrapYahooSearch(value)).toBe(expected)
  })

  it('should return undefined when RK= terminator is missing after an unencoded target', () => {
    const value = new URL('https://r.search.yahoo.com/_ylt=AAA/RU=https://example.com/page')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined for paths without RU= segment', () => {
    const value = new URL('https://r.search.yahoo.com/search?p=test')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined when RK= terminator is missing', () => {
    const value = new URL('https://r.search.yahoo.com/_ylt=AAA/RU=https%3A%2F%2Fexample.com')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined for non-Yahoo hosts', () => {
    const value = new URL(
      'https://example.com/_ylt=AAA/RU=https%3A%2F%2Fexample.com%2Fpage/RK=0/RS=BBB-',
    )

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined when an unencoded RU segment holds no http url', () => {
    const value = new URL('https://r.search.yahoo.com/_ylt=AAA/RU=example.com/page/RK=2/RS=abc')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined when RU= does not start a path segment', () => {
    const value = new URL('https://r.search.yahoo.com//RU=https%3A%2F%2Fexample.com/RK=0')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should return undefined for an empty first segment with an unencoded target', () => {
    const value = new URL('https://r.search.yahoo.com//RU=https://example.com/page/RK=0')

    expect(unwrapYahooSearch(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://r.search.yahoo.com/_ylt=AAA/SIG=BBB/EXP=CCC/RU=https%3A%2F%2Fexample.com%2Farticle%23top/RK=2/RS=DDD-',
    )
    const expected = 'https://example.com/article#top'

    expect(unwrapYahooSearch(value)).toBe(expected)
  })
})
