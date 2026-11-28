import { describe, expect, it } from 'bun:test'
import { unwrapSalesdoubler } from './salesdoubler.js'

describe('unwrapSalesdoubler', () => {
  it('should extract target from dlink param', () => {
    const value = new URL(
      'https://rdr.salesdoubler.com.ua/in/offer/1710?aid=65333&dlink=https%3A%2F%2Fwww.example.com%2Fumovi',
    )
    const expected = 'https://www.example.com/umovi'

    expect(unwrapSalesdoubler(value)).toBe(expected)
  })

  it('should return undefined when dlink param is missing', () => {
    const value = new URL('https://rdr.salesdoubler.com.ua/in/offer/1710?aid=65333')

    expect(unwrapSalesdoubler(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the SalesDoubler host', () => {
    const value = new URL(
      'https://rdr.salesdoubler.com.ua/in/postback/1710?aid=65333&dlink=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSalesdoubler(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/in/offer/1710?aid=65333&dlink=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapSalesdoubler(value)).toBeUndefined()
  })
})
