import { describe, expect, it } from 'bun:test'
import { unwrapNextImage } from './nextImage.js'

describe('unwrapNextImage', () => {
  it('should extract an absolute source', () => {
    const value = new URL(
      'https://example.com/_next/image?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg&w=384&q=75',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapNextImage(value)).toBe(expected)
  })

  it('should resolve a path source against the site', () => {
    const value = new URL(
      'https://example.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fphoto.6e6e9428.png&w=32&q=75',
    )
    const expected = 'https://example.com/_next/static/media/photo.6e6e9428.png'

    expect(unwrapNextImage(value)).toBe(expected)
  })

  it('should extract the source under a base path', () => {
    const value = new URL(
      'https://example.com/docs/_next/image?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg&w=640',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapNextImage(value)).toBe(expected)
  })

  it('should read a raw plus in the source as a space', () => {
    const value = new URL(
      'https://example.com/_next/image?url=https%3A%2F%2Fcdn.example.com%2FC++_logo.png&w=640',
    )
    const expected = 'https://cdn.example.com/C%20%20_logo.png'

    expect(unwrapNextImage(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://example.com/_next/image?w=640&q=75')

    expect(unwrapNextImage(value)).toBeUndefined()
  })

  it('should return undefined for another _next path', () => {
    const value = new URL('https://example.com/_next/static/media/photo.png?url=/a.png')

    expect(unwrapNextImage(value)).toBeUndefined()
  })
})
