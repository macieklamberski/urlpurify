import { describe, expect, it } from 'bun:test'
import { unwrapPodigee } from './podigee.js'

describe('unwrapPodigee', () => {
  it('should keep a literal %25 in the source as written', () => {
    const value = new URL(
      'https://images.podigee-cdn.net/0x,abc=/https://main.podigee-cdn.net/uploads/u702/Vitamin%2520Bildung%2520Podcast%2520Cover.png',
    )
    const expected =
      'https://main.podigee-cdn.net/uploads/u702/Vitamin%2520Bildung%2520Podcast%2520Cover.png'

    expect(unwrapPodigee(value)).toBe(expected)
  })

  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://images.podigee-cdn.net/0x,siN6/https://cdn.example.com/photo.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapPodigee(value)).toBe(expected)
  })

  it('should extract an encoded source', () => {
    const value = new URL(
      'https://images.podigee-cdn.net/0x,siN6/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapPodigee(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://images.podigee-cdn.net/0x,siN6/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapPodigee(value)).toBe(expected)
  })

  it('should return undefined for a path without a source', () => {
    const value = new URL('https://main.podigee-cdn.net/uploads/u17132/photo.jpg')

    expect(unwrapPodigee(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://images.examplepodigee-cdn.net/0x,siN6/https://cdn.example.com/photo.jpg',
    )

    expect(unwrapPodigee(value)).toBeUndefined()
  })
})
