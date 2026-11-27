import { describe, expect, it } from 'bun:test'
import { unwrapWikidot } from './wikidot.js'

describe('unwrapWikidot', () => {
  it('should extract a target glued onto the wiki host', () => {
    const value = new URL('http://film-wiki.wikidot.com//www.example.org/embed/e8frOhxdZmE')
    const expected = 'https://www.example.org/embed/e8frOhxdZmE'

    expect(unwrapWikidot(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://rooms-wiki.wikidot.com//interwiki.example.org/styleFrame.html?priority=2&type=sidebar#top',
    )
    const expected = 'https://interwiki.example.org/styleFrame.html?priority=2&type=sidebar#top'

    expect(unwrapWikidot(value)).toBe(expected)
  })

  it('should return undefined for a page of the wiki', () => {
    const value = new URL('http://film-wiki.wikidot.com/scp-173')

    expect(unwrapWikidot(value)).toBeUndefined()
  })

  it('should return undefined for a host behind a single slash', () => {
    const value = new URL('https://film-wiki.wikidot.com/www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapWikidot(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com//www.example.org/embed/e8frOhxdZmE')

    expect(unwrapWikidot(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('http://wiki.examplewikidot.com//www.example.org/embed/e8frOhxdZmE')

    expect(unwrapWikidot(value)).toBeUndefined()
  })
})
