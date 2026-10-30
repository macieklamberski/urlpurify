import { describe, expect, it } from 'bun:test'
import { unwrapHatenaImage } from './hatenaImage.js'

describe('unwrapHatenaImage', () => {
  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://cdn.image.st-hatena.com/image/scale/abc/width=1300/https://cdn.example.com/photo.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapHatenaImage(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://cdn.image.st-hatena.com/image/scale/abc/width=1300/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapHatenaImage(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://cdn.image.st-hatena.com/image/scale/abc/width=1300/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapHatenaImage(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL(
      'https://cdn.image.st-hatena.com/image/scale/abc/width=1300/fotolife/photo.jpg',
    )

    expect(unwrapHatenaImage(value)).toBeUndefined()
  })
})
