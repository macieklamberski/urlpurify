import { describe, expect, it } from 'bun:test'
import { unwrapNcls } from './ncls.js'

describe('unwrapNcls', () => {
  it('should extract a plain target from d param', () => {
    const value = new URL(
      'https://ncls1.com/irk?enk=bz10dXRoMjEmcz0yNTcyNTEmYj0xNzEwMiZia2Q9c2t5bHVtLmNvbQ==&subid=macworld.com&di=rss&d=https://www.example.com/luminar',
    )
    const expected = 'https://www.example.com/luminar'

    expect(unwrapNcls(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://ncls1.com/irk?enk=bz10dXRoMjEmcz0yNTcyNTEmYj0xNzEwMiZia2Q9c2t5bHVtLmNvbQ==&subid=macworld.com&di=rss&d=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapNcls(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://ncls1.com/irk?enk=bz10dXRoMjEmcz0yNTcyNTEmYj0xNzEwMiZia2Q9c2t5bHVtLmNvbQ==&subid=macworld.com&di=rss&d=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapNcls(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from d param', () => {
    const value = new URL(
      'https://ncls1.com/irk?o=nthd73&s=515050&subid=nbcnews.com&bkd=example.com&di=launch&d=http%3A%2F%2Fwww.example.com%2Fiphone-18-pro%2F',
    )
    const expected = 'http://www.example.com/iphone-18-pro/'

    expect(unwrapNcls(value)).toBe(expected)
  })

  it('should extract the last d param when a click is nested unencoded', () => {
    const value = new URL(
      'https://ncls1.com/irk?enk=bz10dXRoMjEmcz0yNTcyNTEmYj0xNTQ2OSZia2Q9YmVzdGJ1eS5jb20=&subid=pcworld.com&di=rss&d=https://ncls1.com/irk?enk=bz10dXRoMjEmcz0yNTcyNTEmYj0xNTQ2OSZia2Q9YmVzdGJ1eS5jb20=&subid=pcworld.com&di=2-0-550968-7-0-0-0-0&d=https://www.example.com/product/hp-omen-16/JJGH2L954G',
    )
    const expected = 'https://www.example.com/product/hp-omen-16/JJGH2L954G'

    expect(unwrapNcls(value)).toBe(expected)
  })

  it('should return undefined when d param is missing', () => {
    const value = new URL('https://ncls1.com/irk?enk=bz10dXRoMjE&subid=macworld.com&di=rss')

    expect(unwrapNcls(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the ncls1.com host', () => {
    const value = new URL(
      'https://ncls1.com/imp?subid=macworld.com&d=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapNcls(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/irk?subid=macworld.com&d=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapNcls(value)).toBeUndefined()
  })
})
