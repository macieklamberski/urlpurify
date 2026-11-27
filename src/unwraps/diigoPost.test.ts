import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapDiigoPost } from './diigoPost.js'

describe('unwrapDiigoPost', () => {
  it('should extract the page from an encoded url param', () => {
    const value = new URL(
      'http://www.diigo.com/post?url=http%3A%2F%2Fwww.example.com%2Fnwsrm%2Ftxtps%2F2016%2Ftfsk15-eng.html%3Frss&title=Do%20you%20owe%20income%20tax%3F%20Here%E2%80%99s%20how%20to%20make%20paying%20as%20easy%20as%201%2C%202%2C%203!',
    )
    const expected = 'http://www.example.com/nwsrm/txtps/2016/tfsk15-eng.html?rss'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should extract an unencoded page and leave the free-text fields out', () => {
    const value = new URL(
      'http://www.diigo.com/post?url=http://www.example.com/hello-world/&title=Hello+world%21&desc=Welcome%20to%20WordPress.%20This%20is%20your%20first%20post.',
    )
    const expected = 'http://www.example.com/hello-world/'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should extract a page with an encoded colon and raw slashes', () => {
    const value = new URL(
      'https://www.diigo.com/post?url=https%3A//example.com/en/node/30240&title=%E7%8F%BE%E8%A7%80%E7%9A%84%E6%AC%A1%E7%AC%AC&desc=%E5%B0%8E%E5%B8%AB',
    )
    const expected = 'https://example.com/en/node/30240'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should extract the page on the bare host', () => {
    const value = new URL('https://diigo.com/post?url=https%3A%2F%2Fexample.com%2Fpost&title=Hello')
    const expected = 'https://example.com/post'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should extract the page on secure.diigo.com', () => {
    const value = new URL('https://secure.diigo.com/post?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL('https://www.diigo.com/post?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.diigo.com/Post?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDiigoPost(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.diigo.com/post?title=Hello&desc=World')

    expect(unwrapDiigoPost(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.diigo.com/post?url=&title=Hello')

    expect(unwrapDiigoPost(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http page', () => {
    const value = 'https://www.diigo.com/post?url=javascript%3Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapDiigoPost] })).toBe(value)
  })

  it('should return undefined for the url param on another path', () => {
    const value = new URL('https://www.diigo.com/cached?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiigoPost(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/post?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapDiigoPost(value)).toBeUndefined()
  })
})
