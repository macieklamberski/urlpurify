import { describe, expect, it } from 'bun:test'
import { unwrap12ft } from './12ft.js'

describe('unwrap12ft', () => {
  it('should extract the target from the q param', () => {
    const value = new URL(
      'https://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2Fbooks%2Fwhat-to-read%2Fdoes-he-really-understand-books',
    )
    const expected = 'https://www.example.com/books/what-to-read/does-he-really-understand-books'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://12ft.io/proxy?q=https://www.example.com/2022/10/the-watcher-657-boulevard-update.html',
    )
    const expected = 'https://www.example.com/2022/10/the-watcher-657-boulevard-update.html'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should extract the target when an empty param comes before it', () => {
    const value = new URL(
      'https://12ft.io/proxy?&q=https%3A%2F%2Fwww.example.com%2Fstory%2Fmy-son-the-prince',
    )
    const expected = 'https://www.example.com/story/my-son-the-prince'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should extract the target when a ref param comes before it', () => {
    const value = new URL(
      'https://12ft.io/proxy?ref=&q=https://www.example.com/content/ea00d39c-5ec4',
    )
    const expected = 'https://www.example.com/content/ea00d39c-5ec4'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dnews%26page%3D2',
    )
    const expected = 'https://www.example.com/search?q=news&page=2'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should extract the target of a plain http wrapper', () => {
    const value = new URL('http://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrap12ft(value)).toBe(expected)
  })

  it('should return undefined when the q param is missing', () => {
    const value = new URL('https://12ft.io/proxy?ref=')

    expect(unwrap12ft(value)).toBeUndefined()
  })

  it('should return undefined when the q param is empty', () => {
    const value = new URL('https://12ft.io/proxy?q=')

    expect(unwrap12ft(value)).toBeUndefined()
  })

  it('should return undefined for the home page', () => {
    const value = new URL('https://12ft.io/')

    expect(unwrap12ft(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://12ft.io/search?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(value)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the proxy path', () => {
    const value = new URL('https://12ft.io/proxy/x?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/proxy?q=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap12ft(value)).toBeUndefined()
  })
})
