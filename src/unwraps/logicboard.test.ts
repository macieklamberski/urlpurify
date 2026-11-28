import { describe, expect, it } from 'bun:test'
import { unwrapLogicboard } from './logicboard.js'

describe('unwrapLogicboard', () => {
  it('should extract target from s param', () => {
    const value = new URL('https://forum.example.com/away.php?s=https%3A%2F%2Fexample.org%2F')
    const expected = 'https://example.org/'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should extract target behind a forum prefix', () => {
    const value = new URL(
      'https://www.example.com/forum/away.php?s=https%3A%2F%2Fexample.org%2Fd%2FXw7b8XL93Z4RUp',
    )
    const expected = 'https://example.org/d/Xw7b8XL93Z4RUp'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should extract target behind a locale and forum prefix', () => {
    const value = new URL('https://www.example.com/ru/forum/away.php?s=http%3A%2F%2Fexample.org%2F')
    const expected = 'http://example.org/'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('http://www.example.com/forum/away.php?s=https://www.example.org/a+b/')
    const expected = 'https://www.example.org/a+b/'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should keep the percent-encoded query of the target', () => {
    const value = new URL(
      'https://www.example.com/forum/away.php?s=https%3A%2F%2Fwww.example.org%2Fwatch%3Fv%3DDaMwf_C0MHI',
    )
    const expected = 'https://www.example.org/watch?v=DaMwf_C0MHI'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/away.php?s=https%253A%252F%252Fexample.org%252Fa%252F',
    )
    const expected = 'https://example.org/a/'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://www.example.com/away.php?s=https%253A%252F%252Fexample.org%252F100%25',
    )
    const expected = 'https://example.org/100%'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should extract the first s param', () => {
    const value = new URL(
      'https://www.example.com/away.php?s=https%3A%2F%2Fexample.org%2F&s=https%3A%2F%2Fexample.net%2F',
    )
    const expected = 'https://example.org/'

    expect(unwrapLogicboard(value)).toBe(expected)
  })

  it('should return undefined when s param is missing', () => {
    const value = new URL('https://www.example.com/forum/away.php')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })

  it('should return undefined for a non-http s param', () => {
    const value = new URL('https://www.example.com/forum/away.php?s=topic123')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })

  it('should return undefined for the to param of another away page', () => {
    const value = new URL('https://www.example.com/away.php?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL('https://www.example.com/forum/go.php?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })

  it('should return undefined for a path that continues after away.php', () => {
    const value = new URL('https://www.example.com/away.php/x?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })

  it('should return undefined for the path under three prefix segments', () => {
    const value = new URL('https://www.example.com/a/b/c/away.php?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(value)).toBeUndefined()
  })
})
