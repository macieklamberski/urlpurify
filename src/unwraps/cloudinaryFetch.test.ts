import { describe, expect, it } from 'bun:test'
import { unwrapCloudinaryFetch } from './cloudinaryFetch.js'

describe('unwrapCloudinaryFetch', () => {
  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://res.cloudinary.com/demo/image/fetch/w_200/https://cdn.example.com/photo.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapCloudinaryFetch(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://substackcdn.com/image/fetch/$s_!xYz1!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapCloudinaryFetch(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://res.cloudinary.com/demo/image/fetch/w_200/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapCloudinaryFetch(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL('https://res.cloudinary.com/demo/image/upload/w_200/photo.jpg')

    expect(unwrapCloudinaryFetch(value)).toBeUndefined()
  })

  it('should extract the source of a fetch that wraps an upload', () => {
    const value = new URL(
      'https://assets.example.com/x/image/fetch/c_fill,q_75/https://res.cloudinary.com/y/image/upload/v161/photo.jpg',
    )
    const expected = 'https://res.cloudinary.com/y/image/upload/v161/photo.jpg'

    expect(unwrapCloudinaryFetch(value)).toBe(expected)
  })
})
