import { describe, expect, it } from 'bun:test'
import { unwrapGabCompose } from './gabCompose.js'

describe('unwrapGabCompose', () => {
  it('should extract a percent-encoded url', () => {
    const value = new URL(
      'https://gab.com/compose?url=https%3A%2F%2Fexample.com%2Fnfl-game-day-takeaways-week-17-early-games%2F&text=NFL%20Game%20Day%20Takeaways',
    )
    const expected = 'https://example.com/nfl-game-day-takeaways-week-17-early-games/'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should keep the query of an encoded target', () => {
    const value = new URL(
      'https://gab.com/compose?url=http%3A%2F%2Fwww.example.com%2F%3Fid%3D62717&text=Fauci%20Stumbles',
    )
    const expected = 'http://www.example.com/?id=62717'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should extract a raw url', () => {
    const value = new URL('https://gab.com/compose?url=https://example.com/post&text=Hello')
    const expected = 'https://example.com/post'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://gab.com/Compose?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL('https://gab.com/compose?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should extract url and ignore a url held in text', () => {
    const value = new URL(
      'https://gab.com/compose?text=https%3A%2F%2Fexample.org%2Fother&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapGabCompose(value)).toBe(expected)
  })

  it('should return undefined for a url held only in text', () => {
    const value = new URL('https://gab.com/compose?text=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapGabCompose(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://gab.com/compose?url=&text=Hello')

    expect(unwrapGabCompose(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://gab.com/groups?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapGabCompose(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/compose?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapGabCompose(value)).toBeUndefined()
  })
})
