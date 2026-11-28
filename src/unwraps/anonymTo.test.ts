import { describe, expect, it } from 'bun:test'
import { unwrapAnonymTo } from './anonymTo.js'

describe('unwrapAnonymTo', () => {
  it('should extract the unencoded target from the query', () => {
    const value = new URL('http://anonym.to/?http://www.example.com/redirector.php?url=a')
    const expected = 'http://www.example.com/redirector.php?url=a'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL('https://anonym.to/?https://example.com/page#top')
    const expected = 'https://example.com/page#top'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })

  it('should extract the http target from the path with its query', () => {
    const value = new URL('http://anonym.to/http://www.example.com/watch?v=SblB2O7AfP4')
    const expected = 'http://www.example.com/watch?v=SblB2O7AfP4'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })

  it('should extract the https target from the path', () => {
    const value = new URL('http://anonym.to/https://en.example.org/wiki/RIAA')
    const expected = 'https://en.example.org/wiki/RIAA'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })

  it('should extract the target from the path on the www. host', () => {
    const value = new URL('https://www.anonym.to/https://example.com/page')
    const expected = 'https://example.com/page'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })

  it('should return undefined for a path target without a scheme', () => {
    const value = new URL('https://anonym.to/www.example.com/page')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined for a path target with one slash after the scheme', () => {
    const value = new URL('https://anonym.to/http:/www.example.com/watch?v=GDAuedAbb-8')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined when the path target follows another segment', () => {
    const value = new URL('https://anonym.to/about/https://example.com/page')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined for the path shape on another host', () => {
    const value = new URL('https://example.com/https://example.org/page')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined when the query is empty', () => {
    const value = new URL('https://anonym.to/')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://anonym.to/about?https://example.com/page')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/?https://example.org/page')

    expect(unwrapAnonymTo(value)).toBeUndefined()
  })

  it('should decode an encoded query target', () => {
    const value = new URL('http://anonym.to/?https%3A%2F%2Fwww.example.com%2Fpost%3Fa%3D1')
    const expected = 'https://www.example.com/post?a=1'

    expect(unwrapAnonymTo(value)).toBe(expected)
  })
})
