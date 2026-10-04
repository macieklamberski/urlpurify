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
})
