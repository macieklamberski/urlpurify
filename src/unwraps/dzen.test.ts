import { describe, expect, it } from 'bun:test'
import { unwrapDzen } from './dzen.js'

describe('unwrapDzen', () => {
  it('should extract target from to param', () => {
    const value = new URL('https://dzen.ru/away?to=http%3A%2F%2Fexample.com%2F')
    const expected = 'http://example.com/'

    expect(unwrapDzen(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://dzen.ru/away?to=https%3A%2F%2Fexample.com%2Fcatalog%3Fid%3D42%26page%3D2',
    )
    const expected = 'https://example.com/catalog?id=42&page=2'

    expect(unwrapDzen(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('https://dzen.ru/away?to=https://example.com/')
    const expected = 'https://example.com/'

    expect(unwrapDzen(value)).toBe(expected)
  })

  it('should return undefined when to param is missing', () => {
    const value = new URL('https://dzen.ru/away')

    expect(unwrapDzen(value)).toBeUndefined()
  })

  it('should return undefined when to param is empty', () => {
    const value = new URL('https://dzen.ru/away?to=')

    expect(unwrapDzen(value)).toBeUndefined()
  })

  it('should return undefined for an article url with a referrer', () => {
    const value = new URL(
      'https://dzen.ru/a/adTmTLMuFBjFSOoR?utm_referrer=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDzen(value)).toBeUndefined()
  })

  it('should return undefined for other paths on dzen.ru', () => {
    const value = new URL('https://dzen.ru/away/other?to=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDzen(value)).toBeUndefined()
  })
})
