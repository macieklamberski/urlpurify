import { describe, expect, it } from 'bun:test'
import { unwrapAmpCacheImage } from './ampCacheImage.js'

describe('unwrapAmpCacheImage', () => {
  it('should extract an https source from the image path', () => {
    const value = new URL(
      'https://images-example-com.cdn.ampproject.org/i/s/images.example.com/2019/04/photo.jpg',
    )
    const expected = 'https://images.example.com/2019/04/photo.jpg'

    expect(unwrapAmpCacheImage(value)).toBe(expected)
  })

  it('should extract an http source when the s segment is missing', () => {
    const value = new URL(
      'https://pad1-example-com.cdn.ampproject.org/i/pad1.example.com/images/thumb/photo.jpg',
    )
    const expected = 'http://pad1.example.com/images/thumb/photo.jpg'

    expect(unwrapAmpCacheImage(value)).toBe(expected)
  })

  it('should extract an https source from the resized image path', () => {
    const value = new URL(
      'https://www-example-com.cdn.ampproject.org/ii/AW/s/www.example.com/img/2025/07/28/photo.jpg',
    )
    const expected = 'https://www.example.com/img/2025/07/28/photo.jpg'

    expect(unwrapAmpCacheImage(value)).toBe(expected)
  })

  it('should extract an http source from the resized image path', () => {
    const value = new URL('https://cdn.ampproject.org/ii/w1200/www.example.com/files/photo.jpg')
    const expected = 'http://www.example.com/files/photo.jpg'

    expect(unwrapAmpCacheImage(value)).toBe(expected)
  })

  it('should keep the source query and fragment', () => {
    const value = new URL(
      'https://example-files-wordpress-com.cdn.ampproject.org/ii/w680/s/example.files.wordpress.com/2018/03/photo.jpg?w=575#top',
    )
    const expected = 'https://example.files.wordpress.com/2018/03/photo.jpg?w=575#top'

    expect(unwrapAmpCacheImage(value)).toBe(expected)
  })

  it('should return undefined for the document path', () => {
    const value = new URL('https://www-example-com.cdn.ampproject.org/c/s/www.example.com/article')

    expect(unwrapAmpCacheImage(value)).toBeUndefined()
  })

  it('should return undefined for the resource path', () => {
    const value = new URL(
      'https://www-example-com.cdn.ampproject.org/r/s/www.example.com/font.woff2',
    )

    expect(unwrapAmpCacheImage(value)).toBeUndefined()
  })

  it('should return undefined for a resized image path without a source', () => {
    const value = new URL('https://cdn.ampproject.org/ii/w680')

    expect(unwrapAmpCacheImage(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplecdn.ampproject.org/i/s/www.example.com/photo.jpg')

    expect(unwrapAmpCacheImage(value)).toBeUndefined()
  })

  it('should return undefined for the image path on another host', () => {
    const value = new URL('https://example.com/i/s/www.example.com/photo.jpg')

    expect(unwrapAmpCacheImage(value)).toBeUndefined()
  })
})
