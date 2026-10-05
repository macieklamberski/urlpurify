import { describe, expect, it } from 'bun:test'
import { unwrapHirkereso } from './hirkereso.js'

describe('unwrapHirkereso', () => {
  it('should extract the target from a feed click link', () => {
    const url = new URL(
      'https://rd.hirkereso.hu/rd/54253312?partner=rss&url=https%3A%2F%2Fexample.com%2Ftech%2F2026%2F07%2F13%2Fnews%2F',
    )

    expect(unwrapHirkereso(url)).toBe('https://example.com/tech/2026/07/13/news/')
  })

  it('should extract the target from a click link without partner', () => {
    const url = new URL(
      'https://rd.hirkereso.hu/rd/48813522?url=https%3A%2F%2Fexample.com%2Fvasarlas%2F20250402%2Farticle-1176898%3Futm_source%3Dhirkereso',
    )

    expect(unwrapHirkereso(url)).toBe(
      'https://example.com/vasarlas/20250402/article-1176898?utm_source=hirkereso',
    )
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://rd.hirkereso.hu/rd/31297355?url=https://example.blogspot.com')

    expect(unwrapHirkereso(url)).toBe('https://example.blogspot.com')
  })

  it('should return undefined when url is missing', () => {
    const url = new URL('https://rd.hirkereso.hu/rd/54253312?partner=rss')

    expect(unwrapHirkereso(url)).toBeUndefined()
  })

  it('should return undefined for a redirect without the id', () => {
    const url = new URL('https://rd.hirkereso.hu/rd/?partner=rss&url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapHirkereso(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://rd.hirkereso.hu/go/54253312?partner=rss&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapHirkereso(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/rd/54253312?partner=rss&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapHirkereso(url)).toBeUndefined()
  })
})
