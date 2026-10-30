import { describe, expect, it } from 'bun:test'
import { unwrapDevToImage } from './devToImage.js'

describe('unwrapDevToImage', () => {
  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://media2.dev.to/dynamic/image/width=800,height=,fit=scale-down/https://cdn.example.com/photo.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapDevToImage(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://media2.dev.to/dynamic/image/width=800/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapDevToImage(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://media2.dev.to/dynamic/image/width=800,height=,fit=scale-down/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapDevToImage(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL('https://media2.dev.to/uploads/https://cdn.example.com/photo.jpg')

    expect(unwrapDevToImage(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://media2.exampledev.to/dynamic/image/width=800/https://cdn.example.com/photo.jpg',
    )

    expect(unwrapDevToImage(value)).toBeUndefined()
  })
})
