import { describe, expect, it } from 'bun:test'
import { unwrapJianshuGo } from './jianshuGo.js'

describe('unwrapJianshuGo', () => {
  it('should extract target from to param', () => {
    const url = new URL('https://links.jianshu.com/go?to=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapJianshuGo(url)).toBe('https://example.com/article')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://links.jianshu.com/go?other=value')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for non-go Jianshu paths', () => {
    const url = new URL('https://links.jianshu.com/redirect?to=https%3A%2F%2Fexample.com')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for non-Jianshu hosts', () => {
    const url = new URL('https://example.com/go?to=https%3A%2F%2Fother.com')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://www.jianshu.com/go?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplejianshu.com/go?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should extract target from the t param on link.jianshu.com', () => {
    const url = new URL('https://link.jianshu.com/?t=https://example.com/article')

    expect(unwrapJianshuGo(url)).toBe('https://example.com/article')
  })

  it('should decode a percent-encoded target on link.jianshu.com', () => {
    const url = new URL('https://link.jianshu.com/?t=http%3A%2F%2Fexample.com%2Fpage%3Fa%3D1')

    expect(unwrapJianshuGo(url)).toBe('http://example.com/page?a=1')
  })

  it('should decode a twice-encoded target on link.jianshu.com', () => {
    const url = new URL('https://link.jianshu.com/?t=https%253A%252F%252Fexample.com%252Fpage')

    expect(unwrapJianshuGo(url)).toBe('https://example.com/page')
  })

  it('should read t first when the unencoded target brings its own query', () => {
    const url = new URL('https://link.jianshu.com/?t=https://example.com/page?spm=1&raceId=2')

    expect(unwrapJianshuGo(url)).toBe('https://example.com/page?spm=1')
  })

  it('should return undefined for link.jianshu.com without a t param', () => {
    expect(unwrapJianshuGo(new URL('https://link.jianshu.com/'))).toBeUndefined()
    expect(unwrapJianshuGo(new URL('https://link.jianshu.com/?t='))).toBeUndefined()
  })

  it('should return undefined for a sibling path on link.jianshu.com', () => {
    const url = new URL('https://link.jianshu.com/go?t=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for the to param on the root of link.jianshu.com', () => {
    const url = new URL('https://link.jianshu.com/?to=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })

  it('should return undefined for the root path on an unlisted Jianshu host', () => {
    for (const host of ['www.jianshu.com', 'links.jianshu.com', 'jianshu.com']) {
      const url = new URL(`https://${host}/?t=https%3A%2F%2Fexample.com%2Fpage`)

      expect(unwrapJianshuGo(url)).toBeUndefined()
    }
  })

  it('should return undefined for the root path on a lookalike host', () => {
    const url = new URL('https://link.examplejianshu.com/?t=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapJianshuGo(url)).toBeUndefined()
  })
})
