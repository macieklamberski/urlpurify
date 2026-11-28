import { describe, expect, it } from 'bun:test'
import { unwrapLinkwise } from './linkwise.js'

describe('unwrapLinkwise', () => {
  it('should extract target from lnkurl param', () => {
    const value = new URL(
      'https://go.linkwi.se/z/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.com%2Fproduct%2Fmpoukali-thermos-500-ml',
    )
    const expected = 'https://www.example.com/product/mpoukali-thermos-500-ml'

    expect(unwrapLinkwise(value)).toBe(expected)
  })

  it('should return undefined when only the referer is present', () => {
    const value = new URL(
      'https://go.linkwi.se/z/11244-26/CD23055/?referer=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(value)).toBeUndefined()
  })

  it('should return undefined for a click path without the trailing slash', () => {
    const value = new URL(
      'https://go.linkwi.se/z/469-0/CD26866?lnkurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Linkwise host', () => {
    const value = new URL(
      'https://go.linkwi.se/b/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/z/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLinkwise(value)).toBeUndefined()
  })
})
