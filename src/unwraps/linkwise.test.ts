import { describe, expect, it } from 'bun:test'
import { unwrapLinkwise } from './linkwise.js'

describe('unwrapLinkwise', () => {
  it('should extract target from lnkurl param', () => {
    const url = new URL(
      'https://go.linkwi.se/z/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.com%2Fproduct%2Fmpoukali-thermos-500-ml',
    )

    expect(unwrapLinkwise(url)).toBe('https://www.example.com/product/mpoukali-thermos-500-ml')
  })

  it('should return undefined when only the referer is present', () => {
    const url = new URL(
      'https://go.linkwi.se/z/11244-26/CD23055/?referer=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(url)).toBeUndefined()
  })

  it('should return undefined for a click path without the trailing slash', () => {
    const url = new URL(
      'https://go.linkwi.se/z/469-0/CD26866?lnkurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Linkwise host', () => {
    const url = new URL(
      'https://go.linkwi.se/b/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLinkwise(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/z/469-0/CD26866/?lnkurl=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapLinkwise(url)).toBeUndefined()
  })
})
