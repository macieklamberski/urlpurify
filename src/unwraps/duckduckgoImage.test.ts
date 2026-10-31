import { describe, expect, it } from 'bun:test'
import { unwrapDuckduckgoImage } from './duckduckgoImage.js'

describe('unwrapDuckduckgoImage', () => {
  it('should extract an encoded source', () => {
    const value = new URL(
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.example.com%2Fwp-content%2Fuploads%2F2017%2F12%2Fphoto.jpg&f=1&nofb=1&ipt=779f004e908be9a2',
    )
    const expected = 'https://www.example.com/wp-content/uploads/2017/12/photo.jpg'

    expect(unwrapDuckduckgoImage(value)).toBe(expected)
  })

  it('should extract a source on the legacy proxy host', () => {
    const value = new URL(
      'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.example.com%2Fimages%2Fphoto.png&f=1',
    )
    const expected = 'http://www.example.com/images/photo.png'

    expect(unwrapDuckduckgoImage(value)).toBe(expected)
  })

  it('should extract an unencoded source', () => {
    const value = new URL(
      'https://images.duckduckgo.com/iu/?u=https://cdn.example.com/photo.jpg&f=1',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapDuckduckgoImage(value)).toBe(expected)
  })

  it('should extract a twice-encoded source', () => {
    const value = new URL(
      'https://external-content.duckduckgo.com/iu/?u=https%253A%252F%252Fcdn.example.com%252Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapDuckduckgoImage(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://external-content.duckduckgo.com/iu/?f=1')

    expect(unwrapDuckduckgoImage(value)).toBeUndefined()
  })

  it('should return undefined for another path on the proxy', () => {
    const value = new URL(
      'https://external-content.duckduckgo.com/ip3/www.example.com.ico?u=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )

    expect(unwrapDuckduckgoImage(value)).toBeUndefined()
  })

  it('should return undefined for the image path on another host', () => {
    const value = new URL('https://example.com/iu/?u=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg')

    expect(unwrapDuckduckgoImage(value)).toBeUndefined()
  })
})
