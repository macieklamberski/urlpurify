import { describe, expect, it } from 'bun:test'
import { unwrapLazada } from './lazada.js'

describe('unwrapLazada', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://c.lazada.com.ph/t/c.b6Tsw0?intent=false&fallback=true&url=https%3A%2F%2Fwww.example.com.ph%2Fproducts%2Fmelatonin-3mg.html',
    )
    const expected = 'https://www.example.com.ph/products/melatonin-3mg.html'

    expect(unwrapLazada(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://c.lazada.com.my/t/c.6AeX?url=https://www.example.com.my/products/nutrastart-i100483912-s100688388.html&sub_aff_id=Supplement',
    )
    const expected = 'https://www.example.com.my/products/nutrastart-i100483912-s100688388.html'

    expect(unwrapLazada(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://c.lazada.com.my/t/c.6AeX?sub_aff_id=Supplement')

    expect(unwrapLazada(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://c.lazada.com.my/t/c.6AeX?url=')

    expect(unwrapLazada(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('https://c.lazada.com.my/t/other?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLazada(value)).toBeUndefined()
  })

  it('should return undefined for a nested path', () => {
    const value = new URL(
      'https://c.lazada.com.my/t/c.6AeX/extra?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLazada(value)).toBeUndefined()
  })

  it('should return undefined for the path below another segment', () => {
    const value = new URL('https://c.lazada.com.my/x/t/c.6AeX?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLazada(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/t/c.6AeX?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLazada(value)).toBeUndefined()
  })
})
