import { describe, expect, it } from 'bun:test'
import { unwrapBuzzstream } from './buzzstream.js'

describe('unwrapBuzzstream', () => {
  it('should extract target from rl param', () => {
    const value = new URL(
      'https://tx.bz-mail-us1.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fbusiness.example.co.uk%2Fblog%2Fannual-leave-survey',
    )
    const expected = 'https://business.example.co.uk/blog/annual-leave-survey'

    expect(unwrapBuzzstream(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'http://tx.bz-mail-us1.com/1/l/9926d56c244047258af9499bbc383a72?rl=https://www.example.com/channel/UCto7KBa8QxsYLQLnPnKTd0w',
    )
    const expected = 'https://www.example.com/channel/UCto7KBa8QxsYLQLnPnKTd0w'

    expect(unwrapBuzzstream(value)).toBe(expected)
  })

  it('should return undefined when rl param is missing', () => {
    const value = new URL('https://tx.bz-mail-us1.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd')

    expect(unwrapBuzzstream(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://tx.bz-mail-us1.com/1/o/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBuzzstream(value)).toBeUndefined()
  })

  it('should return undefined for a short hex link id', () => {
    const value = new URL('https://tx.bz-mail-us1.com/1/l/5df7b08c?rl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBuzzstream(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'https://example.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapBuzzstream(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL(
      'https://tx.bz-mail-us1.com/x/1/l/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBuzzstream(value)).toBeUndefined()
  })
})
