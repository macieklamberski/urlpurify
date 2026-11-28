import { describe, expect, it } from 'bun:test'
import { unwrapBitrix } from './bitrix.js'

describe('unwrapBitrix', () => {
  it('should extract target from goto param', () => {
    const value = new URL(
      'http://www.example.ru/bitrix/redirect.php?goto=http://www.example.com/gallery/marafon2009/',
    )
    const expected = 'http://www.example.com/gallery/marafon2009/'

    expect(unwrapBitrix(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://www.example.ru/bitrix/redirect.php?goto=http://www.example.com/a+b/',
    )
    const expected = 'http://www.example.com/a+b/'

    expect(unwrapBitrix(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.ru/bitrix/redirect.php?goto=https%253A%252F%252Fwww.example.com%252Fprojects%252F',
    )
    const expected = 'https://www.example.com/projects/'

    expect(unwrapBitrix(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://www.example.ru/bitrix/redirect.php?goto=https%253A%252F%252Fwww.example.com%252F100%25',
    )
    const expected = 'https://www.example.com/100%'

    expect(unwrapBitrix(value)).toBe(expected)
  })

  it('should return undefined when goto param is missing', () => {
    const value = new URL(
      'https://www.example.ru/bitrix/redirect.php?event1=news_out&event2=https://www.example.com/',
    )

    expect(unwrapBitrix(value)).toBeUndefined()
  })

  it('should return undefined for the banner click path', () => {
    const value = new URL('https://www.example.ru/bitrix/rk.php?goto=https://www.example.com/')

    expect(unwrapBitrix(value)).toBeUndefined()
  })
})
