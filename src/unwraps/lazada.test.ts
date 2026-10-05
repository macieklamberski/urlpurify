import { describe, expect, it } from 'bun:test'
import { unwrapLazada } from './lazada.js'

describe('unwrapLazada', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://c.lazada.com.ph/t/c.b6Tsw0?intent=false&fallback=true&url=https%3A%2F%2Fwww.example.com.ph%2Fproducts%2Fmelatonin-3mg.html',
    )

    expect(unwrapLazada(url)).toBe('https://www.example.com.ph/products/melatonin-3mg.html')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://c.lazada.com.my/t/c.6AeX?url=https://www.example.com.my/products/nutrastart-i100483912-s100688388.html&sub_aff_id=Supplement',
    )

    expect(unwrapLazada(url)).toBe(
      'https://www.example.com.my/products/nutrastart-i100483912-s100688388.html',
    )
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://c.lazada.com.my/t/c.6AeX?sub_aff_id=Supplement')

    expect(unwrapLazada(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://c.lazada.com.my/t/c.6AeX?url=')

    expect(unwrapLazada(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://c.lazada.com.my/t/other?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLazada(url)).toBeUndefined()
  })

  it('should return undefined for a nested path', () => {
    const url = new URL(
      'https://c.lazada.com.my/t/c.6AeX/extra?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapLazada(url)).toBeUndefined()
  })

  it('should return undefined for the path below another segment', () => {
    const url = new URL('https://c.lazada.com.my/x/t/c.6AeX?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapLazada(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/t/c.6AeX?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapLazada(url)).toBeUndefined()
  })
})
