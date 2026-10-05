import { describe, expect, it } from 'bun:test'
import { unwrapDzen } from './dzen.js'

describe('unwrapDzen', () => {
  it('should extract target from to param', () => {
    const url = new URL('https://dzen.ru/away?to=http%3A%2F%2Fexample.com%2F')

    expect(unwrapDzen(url)).toBe('http://example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://dzen.ru/away?to=https%3A%2F%2Fexample.com%2Fcatalog%3Fid%3D42%26page%3D2',
    )

    expect(unwrapDzen(url)).toBe('https://example.com/catalog?id=42&page=2')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://dzen.ru/away?to=https://example.com/')

    expect(unwrapDzen(url)).toBe('https://example.com/')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://dzen.ru/away')

    expect(unwrapDzen(url)).toBeUndefined()
  })

  it('should return undefined when to param is empty', () => {
    const url = new URL('https://dzen.ru/away?to=')

    expect(unwrapDzen(url)).toBeUndefined()
  })

  it('should return undefined for an article url with a referrer', () => {
    const url = new URL(
      'https://dzen.ru/a/adTmTLMuFBjFSOoR?utm_referrer=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDzen(url)).toBeUndefined()
  })

  it('should return undefined for other paths on dzen.ru', () => {
    const url = new URL('https://dzen.ru/away/other?to=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDzen(url)).toBeUndefined()
  })
})
