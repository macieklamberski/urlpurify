import { describe, expect, it } from 'bun:test'
import { unwrapJianshuGo } from './jianshuGo.js'

describe('unwrapJianshuGo', () => {
  it('should extract target from to param', () => {
    const value = new URL('https://links.jianshu.com/go?to=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapJianshuGo(value)).toBe(expected)
  })

  it('should return undefined when to param is missing', () => {
    const value = new URL('https://links.jianshu.com/go?other=value')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for non-go Jianshu paths', () => {
    const value = new URL('https://links.jianshu.com/redirect?to=https%3A%2F%2Fexample.com')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for non-Jianshu hosts', () => {
    const value = new URL('https://example.com/go?to=https%3A%2F%2Fother.com')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://www.jianshu.com/go?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplejianshu.com/go?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should extract target from the t param on link.jianshu.com', () => {
    const value = new URL('https://link.jianshu.com/?t=https://example.com/article')
    const expected = 'https://example.com/article'

    expect(unwrapJianshuGo(value)).toBe(expected)
  })

  it('should decode a percent-encoded target on link.jianshu.com', () => {
    const value = new URL('https://link.jianshu.com/?t=http%3A%2F%2Fexample.com%2Fpage%3Fa%3D1')
    const expected = 'http://example.com/page?a=1'

    expect(unwrapJianshuGo(value)).toBe(expected)
  })

  it('should decode a twice-encoded target on link.jianshu.com', () => {
    const value = new URL('https://link.jianshu.com/?t=https%253A%252F%252Fexample.com%252Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapJianshuGo(value)).toBe(expected)
  })

  it('should read t first when the unencoded target brings its own query', () => {
    const value = new URL('https://link.jianshu.com/?t=https://example.com/page?spm=1&raceId=2')
    const expected = 'https://example.com/page?spm=1'

    expect(unwrapJianshuGo(value)).toBe(expected)
  })

  it('should return undefined for link.jianshu.com without a t param', () => {
    expect(unwrapJianshuGo(new URL('https://link.jianshu.com/'))).toBeUndefined()
    expect(unwrapJianshuGo(new URL('https://link.jianshu.com/?t='))).toBeUndefined()
  })

  it('should return undefined for a sibling path on link.jianshu.com', () => {
    const value = new URL('https://link.jianshu.com/go?t=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for the to param on the root of link.jianshu.com', () => {
    const value = new URL('https://link.jianshu.com/?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })

  it('should return undefined for the root path on an unlisted Jianshu host', () => {
    for (const host of ['www.jianshu.com', 'links.jianshu.com', 'jianshu.com']) {
      const value = new URL(`https://${host}/?t=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapJianshuGo(value)).toBeUndefined()
    }
  })

  it('should return undefined for the root path on a lookalike host', () => {
    const value = new URL('https://link.examplejianshu.com/?t=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(value)).toBeUndefined()
  })
})
