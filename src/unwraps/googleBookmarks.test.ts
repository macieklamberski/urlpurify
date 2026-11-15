import { describe, expect, it } from 'bun:test'
import { unwrapGoogleBookmarks } from './googleBookmarks.js'

describe('unwrapGoogleBookmarks', () => {
  it('should extract a raw target from the edit form', () => {
    const value = new URL(
      'http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=http://www.example.com/News/archives/899&title=HTTP+500+Internal+Server+Error+%E2%80%93+Explained+',
    )
    const expected = 'http://www.example.com/News/archives/899'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=http%3A%2F%2Fblog.example.com%2F2011%2F11%2F08%2Fkiosk-browser-grows-up-goes-pro%2F&title=Kiosk+Browser+Grows+Up%2C+Goes+Pro',
    )
    const expected = 'http://blog.example.com/2011/11/08/kiosk-browser-grows-up-goes-pro/'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should extract a target with only its colon encoded from the add form', () => {
    const value = new URL(
      'http://www.google.com/bookmarks/mark?op=add&bkmk=http%3A//example.com/node/59&title=Laksovprisen%202022%20g%C3%A5r%20til%20Tolketjenesten%20ved%20Bergen%20kommune',
    )
    const expected = 'http://example.com/node/59'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should cut a raw target with a query of its own at the next param', () => {
    const value = new URL(
      'http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=http://www.example.com/?p=611&title=Soul+Train',
    )
    const expected = 'http://www.example.com/?p=611'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.google.com/bookmarks/mark?op=edit&bkmk=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'http://www.google.com/Bookmarks/Mark?op=edit&bkmk=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapGoogleBookmarks(value)).toBe(expected)
  })

  it('should return undefined when only the title holds a url', () => {
    const value = new URL(
      'http://www.google.com/bookmarks/mark?op=edit&title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapGoogleBookmarks(value)).toBeUndefined()
  })

  it('should return undefined when the bkmk param is empty', () => {
    const value = new URL('http://www.google.com/bookmarks/mark?op=edit&bkmk=&title=Post')

    expect(unwrapGoogleBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the bookmarks list', () => {
    const value = new URL('https://www.google.com/bookmarks/?bkmk=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapGoogleBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://www.example.com/bookmarks/mark?op=edit&bkmk=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapGoogleBookmarks(value)).toBeUndefined()
  })
})
