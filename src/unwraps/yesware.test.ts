import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapYesware } from './yesware.js'

describe('unwrapYesware', () => {
  it('should drop a space before the target host', () => {
    const value =
      'https://t.yesware.com/tt/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb/cccccccccccccccccccccccccccccccc/%20www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapYesware] })).toBe(expected)
  })

  it('should extract a target with its scheme dropped from the path', () => {
    const value = new URL(
      'http://t.yesware.com/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9172577e0213cd571b7b2df8e/example.com/clubsapply',
    )
    const expected = 'https://example.com/clubsapply'

    expect(unwrapYesware(value)).toBe(expected)
  })

  it('should keep the query and fragment of a target in the path', () => {
    const value = new URL(
      'https://t.yesware.com/tt/78b84b64a8f627e484569f32940350f8768bac3f/08405d376a24e4ac88a432a44a531c8c/432935e0ec79913e5ad14b60b339f2c6/www.example.com/c-916f67f73461c2f8152c31d57b280a2e?term=bde7893f#strategies',
    )
    const expected =
      'https://www.example.com/c-916f67f73461c2f8152c31d57b280a2e?term=bde7893f#strategies'

    expect(unwrapYesware(value)).toBe(expected)
  })

  it('should extract a target from ytl', () => {
    const value = new URL(
      'https://t.yesware.com/tl/3c5694916fdfb30652ed71af9ad5ebe8af4179b5/0c046614bf3b70b9717fcd19749721cd/a017b28ef0f65b768f8b5f9983055bc0?ytl=http%3A%2F%2Fexample.com%2F',
    )
    const expected = 'http://example.com/'

    expect(unwrapYesware(value)).toBe(expected)
  })

  it('should keep the wrapper for a target host cut short inside an escape', () => {
    const value =
      'https://t.yesware.com/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9172577e0213cd571b7b2df8e/www.example.com%2'

    expect(purifyUrl(value, { unwrappers: [unwrapYesware] })).toBe(value)
  })

  it('should return undefined for the tracking path with no target', () => {
    const value = new URL(
      'https://t.yesware.com/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9172577e0213cd571b7b2df8e/',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the tracking path with a short id', () => {
    const value = new URL(
      'https://t.yesware.com/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9/example.com/clubsapply',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the tracking path under another path', () => {
    const value = new URL(
      'https://t.yesware.com/x/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9172577e0213cd571b7b2df8e/example.com/clubsapply',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the link path with a target segment', () => {
    const value = new URL(
      'https://t.yesware.com/tl/3c5694916fdfb30652ed71af9ad5ebe8af4179b5/0c046614bf3b70b9717fcd19749721cd/a017b28ef0f65b768f8b5f9983055bc0/example.com?ytl=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the link path without ytl', () => {
    const value = new URL(
      'https://t.yesware.com/tl/3c5694916fdfb30652ed71af9ad5ebe8af4179b5/0c046614bf3b70b9717fcd19749721cd/a017b28ef0f65b768f8b5f9983055bc0',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the link path with a short id', () => {
    const value = new URL(
      'https://t.yesware.com/tl/3c569491/0c046614bf3b70b9717fcd19749721cd/a017b28ef0f65b768f8b5f9983055bc0?ytl=http%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the bare tracking path', () => {
    const value = new URL('https://t.yesware.com/tt')

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the tracking path on other hosts', () => {
    const value = new URL(
      'https://example.com/tt/cc4aab7ab5585b4f64d82ec15e4f4fe0f25b6e3d/a46491027919e3faf1bdee545ec1da8d/d3d018e9172577e0213cd571b7b2df8e/example.org/clubsapply',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })

  it('should return undefined for the link path on other hosts', () => {
    const value = new URL(
      'https://example.com/tl/3c5694916fdfb30652ed71af9ad5ebe8af4179b5/0c046614bf3b70b9717fcd19749721cd/a017b28ef0f65b768f8b5f9983055bc0?ytl=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapYesware(value)).toBeUndefined()
  })
})
