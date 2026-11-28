import { describe, expect, it } from 'bun:test'
import { unwrapJuejin } from './juejin.js'

describe('unwrapJuejin', () => {
  it('should extract target from target param', () => {
    const value = new URL('https://link.juejin.cn/?target=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapJuejin(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://link.juejin.cn/?other=value')

    expect(unwrapJuejin(value)).toBeUndefined()
  })

  it('should return undefined for non-Juejin hosts', () => {
    const value = new URL('https://example.com/?target=https%3A%2F%2Fother.com')

    expect(unwrapJuejin(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://link.juejin.cn/about?target=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapJuejin(value)).toBeUndefined()
  })
})
