import { describe, expect, it } from 'bun:test'
import { unwrapAnonymTo } from './anonymTo.js'

describe('unwrapAnonymTo', () => {
  it('should extract the unencoded target from the query', () => {
    const url = new URL('http://anonym.to/?http://www.example.com/redirector.php?url=a')

    expect(unwrapAnonymTo(url)).toBe('http://www.example.com/redirector.php?url=a')
  })

  it('should keep the fragment of the target', () => {
    const url = new URL('https://anonym.to/?https://example.com/page#top')

    expect(unwrapAnonymTo(url)).toBe('https://example.com/page#top')
  })

  it('should extract the http target from the path with its query', () => {
    const url = new URL('http://anonym.to/http://www.example.com/watch?v=SblB2O7AfP4')

    expect(unwrapAnonymTo(url)).toBe('http://www.example.com/watch?v=SblB2O7AfP4')
  })

  it('should extract the https target from the path', () => {
    const url = new URL('http://anonym.to/https://en.example.org/wiki/RIAA')

    expect(unwrapAnonymTo(url)).toBe('https://en.example.org/wiki/RIAA')
  })

  it('should return undefined for a path target without a scheme', () => {
    const url = new URL('https://anonym.to/www.example.com/page')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined for a path target with one slash after the scheme', () => {
    const url = new URL('https://anonym.to/http:/www.example.com/watch?v=GDAuedAbb-8')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined when the path target follows another segment', () => {
    const url = new URL('https://anonym.to/about/https://example.com/page')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined for the path shape on another host', () => {
    const url = new URL('https://example.com/https://example.org/page')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined when the query is empty', () => {
    const url = new URL('https://anonym.to/')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://anonym.to/about?https://example.com/page')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/?https://example.org/page')

    expect(unwrapAnonymTo(url)).toBeUndefined()
  })
})
