import { describe, expect, it } from 'bun:test'
import { unwrapYahooMailImage } from './yahooMailImage.js'

describe('unwrapYahooMailImage', () => {
  it('should extract an encoded source', () => {
    const value = new URL(
      'https://ecp.yusercontent.com/mail?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg&t=1554239749&sig=DzxCZnIn6aGz57UknE9zMw--~C',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapYahooMailImage(value)).toBe(expected)
  })

  it('should keep a raw plus in the source', () => {
    const value = new URL(
      'https://ecp.yusercontent.com/mail?url=https%3A%2F%2Fcdn.example.com%2FC++_logo.png',
    )
    const expected = 'https://cdn.example.com/C++_logo.png'

    expect(unwrapYahooMailImage(value)).toBe(expected)
  })

  it('should return a relative source as written', () => {
    const value = new URL('https://ecp.yusercontent.com/mail?url=%2Fuploads%2Fphoto.jpg')
    const expected = '/uploads/photo.jpg'

    expect(unwrapYahooMailImage(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://ecp.yusercontent.com/mail?url=')

    expect(unwrapYahooMailImage(value)).toBeUndefined()
  })

  it('should return undefined for another path on the proxy', () => {
    const value = new URL(
      'https://ecp.yusercontent.com/other?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )

    expect(unwrapYahooMailImage(value)).toBeUndefined()
  })
})
