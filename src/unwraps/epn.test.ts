import { describe, expect, it } from 'bun:test'
import { unwrapEpn } from './epn.js'

describe('unwrapEpn', () => {
  it('should extract target from to param', () => {
    const url = new URL(
      'https://shopnow.pub/redirect/cpa/o/riaqzshw309pzxwcy0hxqbyhss89coh5/?to=https%3A%2F%2Fwww.example.com%2Fitem%2F32770884729.html&sub1=fromtext',
    )

    expect(unwrapEpn(url)).toBe('https://www.example.com/item/32770884729.html')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL(
      'https://shopnow.pub/redirect/cpa/o/riaqzshw309pzxwcy0hxqbyhss89coh5/?sub1=fromtext',
    )

    expect(unwrapEpn(url)).toBeUndefined()
  })

  it('should return undefined for a short click id', () => {
    const url = new URL(
      'https://shopnow.pub/redirect/cpa/o/riaqzshw/?to=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapEpn(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/redirect/cpa/o/riaqzshw309pzxwcy0hxqbyhss89coh5/?to=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapEpn(url)).toBeUndefined()
  })
})
