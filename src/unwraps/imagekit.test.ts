import { describe, expect, it } from 'bun:test'
import { unwrapImagekit } from './imagekit.js'

describe('unwrapImagekit', () => {
  it('should extract an unencoded source', () => {
    const value = new URL('https://ik.imagekit.io/demo/tr:w-200/https://cdn.example.com/photo.jpg')
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapImagekit(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://ik.imagekit.io/demo/tr:w-200/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapImagekit(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://ik.imagekit.io/demo/tr:w-200/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapImagekit(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL('https://ik.imagekit.io/demo/uploads/photo.jpg')

    expect(unwrapImagekit(value)).toBeUndefined()
  })
})
