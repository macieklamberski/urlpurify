import { describe, expect, it } from 'bun:test'
import { unwrapYahooImage } from './yahooImage.js'

describe('unwrapYahooImage', () => {
  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://s.yimg.com/ny/api/res/1.2/As60/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://cdn.example.com/photo.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapYahooImage(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://s.yimg.com/uu/api/res/1.2/As60/YXBw/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapYahooImage(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://s.yimg.com/ny/api/res/1.2/As60/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapYahooImage(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL('https://s.yimg.com/ny/api/other/https://cdn.example.com/photo.jpg')

    expect(unwrapYahooImage(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://s.exampleyimg.com/ny/api/res/1.2/As60/YXBw/https://cdn.example.com/photo.jpg',
    )

    expect(unwrapYahooImage(value)).toBeUndefined()
  })
})
