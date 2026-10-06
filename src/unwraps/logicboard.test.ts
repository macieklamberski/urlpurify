import { describe, expect, it } from 'bun:test'
import { unwrapLogicboard } from './logicboard.js'

describe('unwrapLogicboard', () => {
  it('should extract target from s param', () => {
    const url = new URL('https://forum.example.com/away.php?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(url)).toBe('https://example.org/')
  })

  it('should extract target behind a forum prefix', () => {
    const url = new URL(
      'https://www.example.com/forum/away.php?s=https%3A%2F%2Fexample.org%2Fd%2FXw7b8XL93Z4RUp',
    )

    expect(unwrapLogicboard(url)).toBe('https://example.org/d/Xw7b8XL93Z4RUp')
  })

  it('should extract target behind a locale and forum prefix', () => {
    const url = new URL('https://www.example.com/ru/forum/away.php?s=http%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(url)).toBe('http://example.org/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('http://www.example.com/forum/away.php?s=https://www.example.org/a+b/')

    expect(unwrapLogicboard(url)).toBe('https://www.example.org/a+b/')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'https://www.example.com/forum/away.php?s=https%3A%2F%2Fwww.example.org%2Fwatch%3Fv%3DDaMwf_C0MHI',
    )

    expect(unwrapLogicboard(url)).toBe('https://www.example.org/watch?v=DaMwf_C0MHI')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.com/away.php?s=https%253A%252F%252Fexample.org%252Fa%252F',
    )

    expect(unwrapLogicboard(url)).toBe('https://example.org/a/')
  })

  it('should extract the first s param', () => {
    const url = new URL(
      'https://www.example.com/away.php?s=https%3A%2F%2Fexample.org%2F&s=https%3A%2F%2Fexample.net%2F',
    )

    expect(unwrapLogicboard(url)).toBe('https://example.org/')
  })

  it('should return undefined when s param is missing', () => {
    const url = new URL('https://www.example.com/forum/away.php')

    expect(unwrapLogicboard(url)).toBeUndefined()
  })

  it('should return undefined for a non-http s param', () => {
    const url = new URL('https://www.example.com/forum/away.php?s=topic123')

    expect(unwrapLogicboard(url)).toBeUndefined()
  })

  it('should return undefined for the to param of another away page', () => {
    const url = new URL('https://www.example.com/away.php?to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://www.example.com/forum/go.php?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(url)).toBeUndefined()
  })

  it('should return undefined for the path under three prefix segments', () => {
    const url = new URL('https://www.example.com/a/b/c/away.php?s=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLogicboard(url)).toBeUndefined()
  })
})
