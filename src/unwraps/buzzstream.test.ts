import { describe, expect, it } from 'bun:test'
import { unwrapBuzzstream } from './buzzstream.js'

describe('unwrapBuzzstream', () => {
  it('should extract target from rl param', () => {
    const url = new URL(
      'https://tx.bz-mail-us1.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fbusiness.example.co.uk%2Fblog%2Fannual-leave-survey',
    )

    expect(unwrapBuzzstream(url)).toBe('https://business.example.co.uk/blog/annual-leave-survey')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'http://tx.bz-mail-us1.com/1/l/9926d56c244047258af9499bbc383a72?rl=https://www.example.com/channel/UCto7KBa8QxsYLQLnPnKTd0w',
    )

    expect(unwrapBuzzstream(url)).toBe('https://www.example.com/channel/UCto7KBa8QxsYLQLnPnKTd0w')
  })

  it('should return undefined when rl param is missing', () => {
    const url = new URL('https://tx.bz-mail-us1.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd')

    expect(unwrapBuzzstream(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL(
      'https://tx.bz-mail-us1.com/1/o/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapBuzzstream(url)).toBeUndefined()
  })

  it('should return undefined for a link id that is not 32 hex characters', () => {
    const url = new URL('https://tx.bz-mail-us1.com/1/l/about?rl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBuzzstream(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL(
      'https://example.com/1/l/5df7b08c57ac4ef3befd0dc7885d55cd?rl=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapBuzzstream(url)).toBeUndefined()
  })
})
