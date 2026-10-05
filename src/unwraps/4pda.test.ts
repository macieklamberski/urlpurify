import { describe, expect, it } from 'bun:test'
import { unwrap4pda } from './4pda.js'

describe('unwrap4pda', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'http://4pda.ru/pages/go/?u=https%3A%2F%2Fwww.example.com%2Farticles%2F960271.htm',
    )

    expect(unwrap4pda(url)).toBe('https://www.example.com/articles/960271.htm')
  })

  it('should extract target beside the post params', () => {
    const url = new URL(
      'https://4pda.ru/pages/go/?u=http%3A%2F%2Fwww.example.com%2FR105part1.rar&e=72131946&f=https%3A%2F%2F4pda.ru%2Fforum%2Findex.php%3Fshowtopic%3D896624%26st%3D0%23entry72991353',
    )

    expect(unwrap4pda(url)).toBe('http://www.example.com/R105part1.rar')
  })

  it('should extract target from the path without a trailing slash', () => {
    const url = new URL('https://4pda.to/pages/go?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap4pda(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://4pda.ru/pages/go/?e=72131946')

    expect(unwrap4pda(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://4pda.ru/pages/go/?u=')

    expect(unwrap4pda(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://4pda.ru/forum/index.php?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap4pda(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://www.example.com/pages/go/?u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap4pda(url)).toBeUndefined()
  })
})
