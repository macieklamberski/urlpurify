import { describe, expect, it } from 'bun:test'
import { unwrapSalesflare } from './salesflare.js'

describe('unwrapSalesflare', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://llink.to/?u=http:%2F%2Fexample.com%2F&e=457a8da6503b63f4a7dc570819eb1e79',
    )

    expect(unwrapSalesflare(url)).toBe('http://example.com/')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://llink.to/?e=457a8da6503b63f4a7dc570819eb1e79')

    expect(unwrapSalesflare(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://llink.to/pixel?u=http:%2F%2Fexample.com%2F')

    expect(unwrapSalesflare(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/?u=http:%2F%2Fexample.org%2F')

    expect(unwrapSalesflare(url)).toBeUndefined()
  })
})
