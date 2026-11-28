import { describe, expect, it } from 'bun:test'
import { unwrapGoogle } from './google.js'

describe('unwrapGoogle', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://www.google.com/url?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target from q param', () => {
    const value = new URL('https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should prefer url param over q param', () => {
    const value = new URL(
      'https://www.google.com/url?url=https%3A%2F%2Freal.com&q=https%3A%2F%2Fwrong.com',
    )
    const expected = 'https://real.com'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should return undefined for non-redirect Google URLs', () => {
    const value = new URL('https://www.google.com/search?q=test')

    expect(unwrapGoogle(value)).toBeUndefined()
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://www.google.com/url?sa=t&source=web')

    expect(unwrapGoogle(value)).toBeUndefined()
  })

  it('should return undefined for non-Google hosts', () => {
    const value = new URL('https://example.com/url?url=https%3A%2F%2Fother.com')

    expect(unwrapGoogle(value)).toBeUndefined()
  })

  it('should extract target from google.de host', () => {
    const value = new URL('https://www.google.de/url?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target from google.co.uk host', () => {
    const value = new URL('https://www.google.co.uk/url?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target without www subdomain', () => {
    const value = new URL('https://google.com/url?url=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target from maps.google.com subdomain', () => {
    const value = new URL('https://maps.google.com/url?q=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target from images.google.com subdomain', () => {
    const value = new URL('https://images.google.com/url?q=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })

  it('should extract target from clients1.google.com subdomain', () => {
    const value = new URL('https://clients1.google.com/url?q=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapGoogle(value)).toBe(expected)
  })
})
