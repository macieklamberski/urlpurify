import { describe, expect, it } from 'bun:test'
import { unwrap4pda } from './4pda.js'

describe('unwrap4pda', () => {
  it('should extract target from u param', () => {
    const value = new URL(
      'http://4pda.ru/pages/go/?u=https%3A%2F%2Fwww.example.com%2Farticles%2F960271.htm',
    )
    const expected = 'https://www.example.com/articles/960271.htm'

    expect(unwrap4pda(value)).toBe(expected)
  })

  it('should extract target beside the post params', () => {
    const value = new URL(
      'https://4pda.ru/pages/go/?u=http%3A%2F%2Fwww.example.com%2FR105part1.rar&e=72131946&f=https%3A%2F%2F4pda.ru%2Fforum%2Findex.php%3Fshowtopic%3D896624%26st%3D0%23entry72991353',
    )
    const expected = 'http://www.example.com/R105part1.rar'

    expect(unwrap4pda(value)).toBe(expected)
  })

  it('should extract target from the path without a trailing slash', () => {
    const value = new URL('https://4pda.to/pages/go?u=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrap4pda(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://4pda.ru/pages/go/?e=72131946')

    expect(unwrap4pda(value)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const value = new URL('https://4pda.ru/pages/go/?u=')

    expect(unwrap4pda(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://4pda.ru/forum/index.php?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap4pda(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('https://www.example.com/pages/go/?u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap4pda(value)).toBeUndefined()
  })
})
