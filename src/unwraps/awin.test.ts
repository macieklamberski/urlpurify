import { describe, expect, it } from 'bun:test'
import { unwrapAwin } from './awin.js'

describe('unwrapAwin', () => {
  it('should extract target from ued param', () => {
    const url = new URL(
      'https://www.awin1.com/cread.php?awinmid=1234&awinaffid=5678&ued=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapAwin(url)).toBe('https://example.com/product')
  })

  it('should fall back to p param when ued is missing', () => {
    const url = new URL(
      'https://www.awin1.com/cread.php?awinmid=1234&p=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapAwin(url)).toBe('https://example.com/other')
  })

  it('should return undefined when both ued and p are missing', () => {
    const url = new URL('https://www.awin1.com/cread.php?awinmid=1234&awinaffid=5678')

    expect(unwrapAwin(url)).toBeUndefined()
  })

  it('should return undefined for non-Awin hosts', () => {
    const url = new URL('https://example.com/cread.php?ued=https%3A%2F%2Fother.com')

    expect(unwrapAwin(url)).toBeUndefined()
  })

  it('should extract target from ued param on the bare host', () => {
    const url = new URL(
      'https://awin1.com/cread.php?awinmid=15473&awinaffid=256133&clickref=dfdeals&ued=https://example.com/products/keyboard',
    )

    expect(unwrapAwin(url)).toBe('https://example.com/products/keyboard')
  })

  it('should extract target from p param on awclick.php', () => {
    const url = new URL(
      'https://www.awin1.com/awclick.php?awinmid=30663&awinaffid=103504&clickref=site-gb-4387039249061362643&p=https%3A%2F%2Fexample.com%2Fpages%2Four-story',
    )

    expect(unwrapAwin(url)).toBe('https://example.com/pages/our-story')
  })

  it('should extract target from ued param on awclick.php', () => {
    const url = new URL(
      'https://www.awin1.com/awclick.php?mid=67716&id=740219&clickref=user-52396-src-web&ued=https%3A%2F%2Fexample.com%2Fproducts%2Fring',
    )

    expect(unwrapAwin(url)).toBe('https://example.com/products/ring')
  })

  it('should return undefined when awclick.php carries a url only in clickref', () => {
    const url = new URL(
      'http://www.awin1.com/awclick.php?gid=312277&mid=7505&awinaffid=298011&linkid=648330&clickref=https://example.com/hotels',
    )

    expect(unwrapAwin(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Awin host', () => {
    const url = new URL('https://www.awin1.com/other.php?p=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(url)).toBeUndefined()
  })

  it('should extract target from ued param on a subdomain no specimen shows', () => {
    const url = new URL('https://ui.awin1.com/cread.php?ued=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(url)).toBe('https://example.com/page')
  })

  it('should extract target from p param on awclick.php on the bare host', () => {
    const url = new URL('https://awin1.com/awclick.php?p=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampleawin1.com/cread.php?ued=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapAwin(url)).toBeUndefined()
  })
})
