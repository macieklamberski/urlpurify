import { describe, expect, it } from 'bun:test'
import { unwrap12ft } from './12ft.js'

describe('unwrap12ft', () => {
  it('should extract the target from the q param', () => {
    const url = new URL(
      'https://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2Fbooks%2Fwhat-to-read%2Fdoes-he-really-understand-books',
    )

    expect(unwrap12ft(url)).toBe(
      'https://www.example.com/books/what-to-read/does-he-really-understand-books',
    )
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://12ft.io/proxy?q=https://www.example.com/2022/10/the-watcher-657-boulevard-update.html',
    )

    expect(unwrap12ft(url)).toBe(
      'https://www.example.com/2022/10/the-watcher-657-boulevard-update.html',
    )
  })

  it('should extract the target when an empty param comes before it', () => {
    const url = new URL(
      'https://12ft.io/proxy?&q=https%3A%2F%2Fwww.example.com%2Fstory%2Fmy-son-the-prince',
    )

    expect(unwrap12ft(url)).toBe('https://www.example.com/story/my-son-the-prince')
  })

  it('should extract the target when a ref param comes before it', () => {
    const url = new URL(
      'https://12ft.io/proxy?ref=&q=https://www.example.com/content/ea00d39c-5ec4',
    )

    expect(unwrap12ft(url)).toBe('https://www.example.com/content/ea00d39c-5ec4')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dnews%26page%3D2',
    )

    expect(unwrap12ft(url)).toBe('https://www.example.com/search?q=news&page=2')
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL('http://12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(url)).toBe('https://www.example.com/')
  })

  it('should extract the target from a subdomain no specimen shows', () => {
    const url = new URL('https://www.12ft.io/proxy?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when the q param is missing', () => {
    const url = new URL('https://12ft.io/proxy?ref=')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined when the q param is empty', () => {
    const url = new URL('https://12ft.io/proxy?q=')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for the home page', () => {
    const url = new URL('https://12ft.io/')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://12ft.io/search?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the proxy path', () => {
    const url = new URL('https://12ft.io/proxy/x?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://www.example.com/proxy?q=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://not12ft.io/proxy?q=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain in its name', () => {
    const url = new URL('https://12ft.io.example.net/proxy?q=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })

  it('should return undefined for a host that replaces the dot with another character', () => {
    const url = new URL('https://www.12ft-io/proxy?q=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrap12ft(url)).toBeUndefined()
  })
})
