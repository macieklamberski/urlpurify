import { describe, expect, it } from 'bun:test'
import { unwrapJuejin } from './juejin.js'

describe('unwrapJuejin', () => {
  it('should extract target from target param', () => {
    const url = new URL('https://link.juejin.cn/?target=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapJuejin(url)).toBe('https://example.com/post')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://link.juejin.cn/?other=value')

    expect(unwrapJuejin(url)).toBeUndefined()
  })

  it('should return undefined for non-Juejin hosts', () => {
    const url = new URL('https://example.com/?target=https%3A%2F%2Fother.com')

    expect(unwrapJuejin(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://cdn.juejin.cn/?target=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapJuejin(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplejuejin.cn/?target=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapJuejin(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://link.juejin.cn/about?target=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapJuejin(url)).toBeUndefined()
  })
})
