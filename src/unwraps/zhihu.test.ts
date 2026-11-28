import { describe, expect, it } from 'bun:test'
import { unwrapZhihu } from './zhihu.js'

describe('unwrapZhihu', () => {
  it('should extract target from target param', () => {
    const value = new URL('https://link.zhihu.com/?target=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapZhihu(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://link.zhihu.com/?other=value')

    expect(unwrapZhihu(value)).toBeUndefined()
  })

  it('should return undefined for non-Zhihu hosts', () => {
    const value = new URL('https://example.com/?target=https%3A%2F%2Fother.com')

    expect(unwrapZhihu(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://link.zhihu.com/question?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapZhihu(value)).toBeUndefined()
  })
})
