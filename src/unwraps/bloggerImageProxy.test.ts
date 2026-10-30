import { describe, expect, it } from 'bun:test'
import { unwrapBloggerImageProxy } from './bloggerImageProxy.js'

describe('unwrapBloggerImageProxy', () => {
  it('should extract an encoded source', () => {
    const value = new URL(
      'https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?container=blogger&gadget=a&rewriteMime=image%2F*&url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapBloggerImageProxy(value)).toBe(expected)
  })

  it('should keep a raw plus in the source', () => {
    const value = new URL(
      'https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=https%3A%2F%2Fcdn.example.com%2FC++_logo.png',
    )
    const expected = 'https://cdn.example.com/C++_logo.png'

    expect(unwrapBloggerImageProxy(value)).toBe(expected)
  })

  it('should return a relative source as written', () => {
    const value = new URL(
      'https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=%2Fuploads%2Fphoto.jpg',
    )
    const expected = '/uploads/photo.jpg'

    expect(unwrapBloggerImageProxy(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL(
      'https://images-blogger-opensocial.googleusercontent.com/gadgets/proxy?container=blogger&gadget=a&rewriteMime=image%2F*&url=',
    )

    expect(unwrapBloggerImageProxy(value)).toBeUndefined()
  })

  it('should return undefined for another path on the proxy', () => {
    const value = new URL(
      'https://images-blogger-opensocial.googleusercontent.com/other?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )

    expect(unwrapBloggerImageProxy(value)).toBeUndefined()
  })
})
