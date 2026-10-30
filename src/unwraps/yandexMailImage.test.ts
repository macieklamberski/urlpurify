import { describe, expect, it } from 'bun:test'
import { unwrapYandexMailImage } from './yandexMailImage.js'

describe('unwrapYandexMailImage', () => {
  it('should extract an encoded source', () => {
    const value = new URL(
      'https://resize.yandex.net/mailservice?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg&proxy=yes&key=fbb6e138eabfa3da556a345b6f3faea8',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapYandexMailImage(value)).toBe(expected)
  })

  it('should keep a raw plus in the source', () => {
    const value = new URL(
      'https://resize.yandex.net/mailservice?url=https%3A%2F%2Fcdn.example.com%2FC++_logo.png',
    )
    const expected = 'https://cdn.example.com/C++_logo.png'

    expect(unwrapYandexMailImage(value)).toBe(expected)
  })

  it('should return a relative source as written', () => {
    const value = new URL('https://resize.yandex.net/mailservice?url=%2Fuploads%2Fphoto.jpg')
    const expected = '/uploads/photo.jpg'

    expect(unwrapYandexMailImage(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://resize.yandex.net/mailservice?url=')

    expect(unwrapYandexMailImage(value)).toBeUndefined()
  })

  it('should return undefined for another path on the proxy', () => {
    const value = new URL(
      'https://resize.yandex.net/other?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )

    expect(unwrapYandexMailImage(value)).toBeUndefined()
  })
})
