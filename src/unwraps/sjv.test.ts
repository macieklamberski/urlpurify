import { describe, expect, it } from 'bun:test'
import { unwrapSjv } from './sjv.js'

describe('unwrapSjv', () => {
  it('should extract target from u param on a merchant subdomain', () => {
    const url = new URL(
      'https://merchant.sjv.io/c/1234567/89012/3456?subId1=abc&u=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapSjv(url)).toBe('https://example.com/product')
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://a.b.sjv.io/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBe('https://example.com/item')
  })

  it('should return undefined for the bare domain', () => {
    const url = new URL('https://sjv.io/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should extract target from a short id path', () => {
    const url = new URL(
      'https://merchant.sjv.io/aB3dE9?subId1=abc&u=https%3A%2F%2Fexample.com%2Fitem',
    )

    expect(unwrapSjv(url)).toBe('https://example.com/item')
  })

  it('should return undefined for a slug longer than a short id', () => {
    const url = new URL('https://merchant.sjv.io/about-us?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://merchant.sjv.io/c/1/2/3?subId1=abc')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for the root path', () => {
    const url = new URL('https://merchant.sjv.io/?u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path', () => {
    const url = new URL('https://merchant.sjv.io/c/1/2?u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment after the ids', () => {
    const url = new URL('https://merchant.sjv.io/c/1/2/3/4?u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/c/1/2/3?u=https%3A%2F%2Fother.com')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplesjv.io/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should extract target from a 5 character short id', () => {
    const url = new URL('https://square.sjv.io/Y6oeO?u=https%3A%2F%2Fsquareup.com%2Fus%2Fen')

    expect(unwrapSjv(url)).toBe('https://squareup.com/us/en')
  })

  it('should return undefined for a 7 character slug', () => {
    const url = new URL('https://merchant.sjv.io/aB3dE9f?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for a 4 character slug', () => {
    const url = new URL('https://merchant.sjv.io/aB3d?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBeUndefined()
  })

  it('should return undefined for the c path without a last id', () => {
    const url = new URL('https://merchant.sjv.io/c/1/2/?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapSjv(url)).toBeUndefined()
  })
})
