import { describe, expect, it } from 'bun:test'
import { unwrapYahooSearch } from './yahooSearch.js'

describe('unwrapYahooSearch', () => {
  it('should extract target from RU path segment', () => {
    const url = new URL(
      'https://r.search.yahoo.com/_ylt=AAA/SIG=BBB/EXP=CCC/RU=https%3A%2F%2Fexample.com%2Farticle/RK=2/RS=DDD-',
    )

    expect(unwrapYahooSearch(url)).toBe('https://example.com/article')
  })

  it('should extract unencoded target from RU path segment', () => {
    const url = new URL(
      'https://r.search.yahoo.com/_ylt=AwrJ6SUKtuNeVsAAXDhXNyoA;_ylu=X3oDMTEyOGI4bGNnBGNvbG8DYmYxBHBvcwMxBHZ0aWQDQjg3NDZfMQRzZWMDc3I-/RV=2/RE=1592010379/RO=10/RU=https://www.example.com/en/main.html/RK=2/RS=h9cMUNkezgC.X6SqpQKt',
    )

    expect(unwrapYahooSearch(url)).toBe('https://www.example.com/en/main.html')
  })

  it('should keep the trailing slash of an unencoded target before RK=', () => {
    const url = new URL(
      'https://r.search.yahoo.com/_ylt=AwrEqavrkc1pMgIAU8dXNyoA;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3Ny/RV=2/RE=1776289515/RO=10/RU=https://example.org//RK=2/RS=q1ph58zOQdFBKJeNiGTkymv7Dio-',
    )

    expect(unwrapYahooSearch(url)).toBe('https://example.org/')
  })

  it('should return undefined when RK= terminator is missing after an unencoded target', () => {
    const url = new URL('https://r.search.yahoo.com/_ylt=AAA/RU=https://example.com/page')

    expect(unwrapYahooSearch(url)).toBeUndefined()
  })

  it('should return undefined for paths without RU= segment', () => {
    const url = new URL('https://r.search.yahoo.com/search?p=test')

    expect(unwrapYahooSearch(url)).toBeUndefined()
  })

  it('should return undefined when RK= terminator is missing', () => {
    const url = new URL('https://r.search.yahoo.com/_ylt=AAA/RU=https%3A%2F%2Fexample.com')

    expect(unwrapYahooSearch(url)).toBeUndefined()
  })

  it('should return undefined for non-Yahoo hosts', () => {
    const url = new URL(
      'https://example.com/_ylt=AAA/RU=https%3A%2F%2Fexample.com%2Fpage/RK=0/RS=BBB-',
    )

    expect(unwrapYahooSearch(url)).toBeUndefined()
  })
})
