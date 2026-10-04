import { describe, expect, it } from 'bun:test'
import { unwrapZhihu } from './zhihu.js'

describe('unwrapZhihu', () => {
  it('should extract target from target param', () => {
    const url = new URL('https://link.zhihu.com/?target=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapZhihu(url)).toBe('https://example.com/article')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://link.zhihu.com/?other=value')

    expect(unwrapZhihu(url)).toBeUndefined()
  })

  it('should return undefined for non-Zhihu hosts', () => {
    const url = new URL('https://example.com/?target=https%3A%2F%2Fother.com')

    expect(unwrapZhihu(url)).toBeUndefined()
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://go.zhihu.com/?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapZhihu(url)).toBe('https://example.com/page')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://link.zhihu.com/question?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapZhihu(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplezhihu.com/?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapZhihu(url)).toBeUndefined()
  })
})
