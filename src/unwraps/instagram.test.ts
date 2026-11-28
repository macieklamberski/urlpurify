import { describe, expect, it } from 'bun:test'
import { unwrapInstagram } from './instagram.js'

describe('unwrapInstagram', () => {
  it('should extract target from u param on l.instagram.com', () => {
    const url = new URL('https://l.instagram.com/?u=https%3A%2F%2Fexample.com%2Fpage&e=ABC&s=1')

    expect(unwrapInstagram(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://l.instagram.com/?e=ABC')

    expect(unwrapInstagram(url)).toBeUndefined()
  })

  it('should return undefined for non-Instagram hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapInstagram(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://l.instagram.com/accounts/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapInstagram(url)).toBeUndefined()
  })
})
