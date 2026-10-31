import { describe, expect, it } from 'bun:test'
import { unwrapCloudflareImages } from './cloudflareImages.js'

describe('unwrapCloudflareImages', () => {
  it('should extract an absolute source from a resizing url', () => {
    const value = new URL(
      'https://files.example.com/cdn-cgi/image/width=1080,quality=80/https://cdn.example.com/s3fs/photo.jpg',
    )
    const expected = 'https://cdn.example.com/s3fs/photo.jpg'

    expect(unwrapCloudflareImages(value)).toBe(expected)
  })

  it('should resolve a relative source against the zone', () => {
    const value = new URL('https://example.com/cdn-cgi/image/width=200/uploads/photo.jpg')
    const expected = 'https://example.com/uploads/photo.jpg'

    expect(unwrapCloudflareImages(value)).toBe(expected)
  })

  it('should decode an encoded source', () => {
    const value = new URL(
      'https://example.com/cdn-cgi/image/fit=cover/https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapCloudflareImages(value)).toBe(expected)
  })

  it('should keep the query of the source', () => {
    const value = new URL(
      'https://example.com/cdn-cgi/image/width=200/https://cdn.example.com/photo.jpg?v=2',
    )
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapCloudflareImages(value)).toBe(expected)
  })

  it('should extract the source from a passthrough url', () => {
    const value = new URL(
      'https://assets.example.com/cdn-cgi/plain/https://cdn.example.com/wp-content/uploads/photo.jpg',
    )
    const expected = 'https://cdn.example.com/wp-content/uploads/photo.jpg'

    expect(unwrapCloudflareImages(value)).toBe(expected)
  })

  it('should return undefined for a passthrough url with a relative source', () => {
    const value = new URL('https://assets.example.com/cdn-cgi/plain/uploads/photo.jpg')

    expect(unwrapCloudflareImages(value)).toBeUndefined()
  })

  it('should return undefined for a resizing url without a source', () => {
    const value = new URL('https://example.com/cdn-cgi/image/width=200/')

    expect(unwrapCloudflareImages(value)).toBeUndefined()
  })

  it('should return undefined for a resizing path below the root', () => {
    const value = new URL(
      'https://example.com/blog/cdn-cgi/image/width=200/https://cdn.example.com/photo.jpg',
    )

    expect(unwrapCloudflareImages(value)).toBeUndefined()
  })

  it('should return undefined for another cdn-cgi path', () => {
    const value = new URL('https://example.com/cdn-cgi/l/email-protection')

    expect(unwrapCloudflareImages(value)).toBeUndefined()
  })
})
