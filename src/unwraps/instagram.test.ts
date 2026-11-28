import { describe, expect, it } from 'bun:test'
import { unwrapInstagram } from './instagram.js'

describe('unwrapInstagram', () => {
  it('should extract target from u param on l.instagram.com', () => {
    const value = new URL('https://l.instagram.com/?u=https%3A%2F%2Fexample.com%2Fpage&e=ABC&s=1')
    const expected = 'https://example.com/page'

    expect(unwrapInstagram(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://l.instagram.com/?e=ABC')

    expect(unwrapInstagram(value)).toBeUndefined()
  })

  it('should return undefined for non-Instagram hosts', () => {
    const value = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapInstagram(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://l.instagram.com/accounts/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapInstagram(value)).toBeUndefined()
  })
})
