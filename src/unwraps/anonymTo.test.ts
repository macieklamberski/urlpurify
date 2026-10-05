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
