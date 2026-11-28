import { describe, expect, it } from 'bun:test'
import { unwrapAwin } from './awin.js'

describe('unwrapAwin', () => {
  it('should extract target from ued param', () => {
    const value = new URL(
      'https://www.awin1.com/cread.php?awinmid=1234&awinaffid=5678&ued=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapAwin(value)).toBe(expected)
  })

  it('should fall back to p param when ued is missing', () => {
    const value = new URL(
      'https://www.awin1.com/cread.php?awinmid=1234&p=https%3A%2F%2Fexample.com%2Fother',
    )
    const expected = 'https://example.com/other'

    expect(unwrapAwin(value)).toBe(expected)
  })

  it('should return undefined when both ued and p are missing', () => {
    const value = new URL('https://www.awin1.com/cread.php?awinmid=1234&awinaffid=5678')

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should return undefined for non-Awin hosts', () => {
    const value = new URL('https://example.com/cread.php?ued=https%3A%2F%2Fother.com')

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should extract target from ued param on the bare host', () => {
    const value = new URL(
      'https://awin1.com/cread.php?awinmid=15473&awinaffid=256133&clickref=dfdeals&ued=https://example.com/products/keyboard',
    )
    const expected = 'https://example.com/products/keyboard'

    expect(unwrapAwin(value)).toBe(expected)
  })

  it('should extract target from p param on awclick.php', () => {
    const value = new URL(
      'https://www.awin1.com/awclick.php?awinmid=30663&awinaffid=103504&clickref=site-gb-4387039249061362643&p=https%3A%2F%2Fexample.com%2Fpages%2Four-story',
    )
    const expected = 'https://example.com/pages/our-story'

    expect(unwrapAwin(value)).toBe(expected)
  })

  it('should extract target from ued param on awclick.php', () => {
    const value = new URL(
      'https://www.awin1.com/awclick.php?mid=67716&id=740219&clickref=user-52396-src-web&ued=https%3A%2F%2Fexample.com%2Fproducts%2Fring',
    )
    const expected = 'https://example.com/products/ring'

    expect(unwrapAwin(value)).toBe(expected)
  })

  it('should return undefined when awclick.php carries a url only in clickref', () => {
    const value = new URL(
      'http://www.awin1.com/awclick.php?gid=312277&mid=7505&awinaffid=298011&linkid=648330&clickref=https://example.com/hotels',
    )

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Awin host', () => {
    const value = new URL('https://www.awin1.com/other.php?p=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://exampleawin1.com/cread.php?ued=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://ui.awin1.com/cread.php?ued=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(value)).toBeUndefined()
  })

  it('should extract target from awclick.php on the bare host', () => {
    const value = new URL('https://awin1.com/awclick.php?p=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapAwin(value)).toBe(expected)
  })
})
