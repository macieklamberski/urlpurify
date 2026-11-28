import { describe, expect, it } from 'bun:test'
import { unwrapYahooImage } from './yahooImage.js'

describe('unwrapYahooImage', () => {
  it('should keep a literal %25 in the source as written', () => {
    const value = new URL(
      'https://s.yimg.com/ny/api/res/1.2/abc/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://cdn.example.com/a%2520b.png',
    )
    const expected = 'https://cdn.example.com/a%2520b.png'

    expect(unwrapYahooImage(value)).toBe(expected)
  })

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

  it('should drop the query of the link after an encoded source', () => {
    const value = new URL(
      'https://s.yimg.com/uu/api/res/1.2/As60/YXBw/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg?resize=640%2C360',
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

  it('should scan a long run of api prefixes without a source in linear time', () => {
    const value = new URL(`https://s.yimg.com${'/api/res/x'.repeat(10000)}`)
    const start = performance.now()

    unwrapYahooImage(value)

    expect(performance.now() - start).toBeLessThan(50)
  })

  it('should scan a long run of api prefixes before a twice-encoded scheme in linear time', () => {
    const value = new URL(`https://s.yimg.com/ny${'/api/res/'.repeat(8000)}https%253Ax`)
    const start = performance.now()

    unwrapYahooImage(value)

    expect(performance.now() - start).toBeLessThan(50)
  })

  it('should drop the link fragment', () => {
    const value = new URL(
      'https://s.yimg.com/ny/api/res/1.2/abc/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https://cdn.example.com/photo.jpg#top',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapYahooImage(value)).toBe(expected)
  })

  it('should decode a source encoded twice', () => {
    const value = new URL(
      'https://s.yimg.com/ny/api/res/1.2/abc/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MA--/https%253A%252F%252Fcdn.example.com%252Fphoto.png',
    )
    const expected = 'https://cdn.example.com/photo.png'

    expect(unwrapYahooImage(value)).toBe(expected)
  })
})
