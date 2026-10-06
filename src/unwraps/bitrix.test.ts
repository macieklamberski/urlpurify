import { describe, expect, it } from 'bun:test'
import { unwrapBitrix } from './bitrix.js'

describe('unwrapBitrix', () => {
  it('should extract target from goto param', () => {
    const url = new URL(
      'http://www.example.ru/bitrix/redirect.php?goto=http://www.example.com/gallery/marafon2009/',
    )

    expect(unwrapBitrix(url)).toBe('http://www.example.com/gallery/marafon2009/')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.ru/bitrix/redirect.php?goto=http://www.example.com/a+b/',
    )

    expect(unwrapBitrix(url)).toBe('http://www.example.com/a+b/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.ru/bitrix/redirect.php?goto=https%253A%252F%252Fwww.example.com%252Fprojects%252F',
    )

    expect(unwrapBitrix(url)).toBe('https://www.example.com/projects/')
  })

  it('should return undefined when goto param is missing', () => {
    const url = new URL(
      'https://www.example.ru/bitrix/redirect.php?event1=news_out&event2=https://www.example.com/',
    )

    expect(unwrapBitrix(url)).toBeUndefined()
  })

  it('should return undefined for the banner click path', () => {
    const url = new URL('https://www.example.ru/bitrix/rk.php?goto=https://www.example.com/')

    expect(unwrapBitrix(url)).toBeUndefined()
  })
})
