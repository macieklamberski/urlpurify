import { describe, expect, it } from 'bun:test'
import { unwrapEmbedly } from './embedly.js'

describe('unwrapEmbedly', () => {
  it('should extract the player from the src param before the page', () => {
    const value = new URL(
      'https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fvideo.example.com%2Fembed%2FSU4fj_aEMVw&url=https%3A%2F%2Fvideo.example.com%2Fwatch%3Fv%3DSU4fj_aEMVw&image=https%3A%2F%2Fimg.example.com%2Fvi%2FSU4fj_aEMVw%2Fhqdefault.jpg&key=8ee8a2e6a8cc47aab1a5ee67f9a178e0&type=text%2Fhtml',
    )
    const expected = 'https://video.example.com/embed/SU4fj_aEMVw'

    expect(unwrapEmbedly(value)).toBe(expected)
  })

  it('should extract the player from the src param', () => {
    const value = new URL(
      'https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fexample.com%2Fembed',
    )
    const expected = 'https://example.com/embed'

    expect(unwrapEmbedly(value)).toBe(expected)
  })

  it('should extract the page from the url param without a src param', () => {
    const value = new URL(
      'https://cdn.embedly.com/widgets/media.html?url=https%3A%2F%2Fexample.com%2Fwatch%3Fv%3D123',
    )
    const expected = 'https://example.com/watch?v=123'

    expect(unwrapEmbedly(value)).toBe(expected)
  })

  it('should extract the page from the url param when the src param is empty', () => {
    const value = new URL(
      'https://cdn.embedly.com/widgets/media.html?src=&url=https%3A%2F%2Fexample.com%2Fwatch%3Fv%3D123',
    )
    const expected = 'https://example.com/watch?v=123'

    expect(unwrapEmbedly(value)).toBe(expected)
  })

  it('should extract the page on the www host', () => {
    const value = new URL(
      'https://www.embedly.com/widgets/media.html?url=https%3A%2F%2Fexample.com%2Fvideo%2F123',
    )
    const expected = 'https://example.com/video/123'

    expect(unwrapEmbedly(value)).toBe(expected)
  })

  it('should return undefined when both params are missing', () => {
    const value = new URL('https://cdn.embedly.com/widgets/media.html?other=value')

    expect(unwrapEmbedly(value)).toBeUndefined()
  })

  it('should return undefined for non-Embedly hosts', () => {
    const value = new URL('https://example.com/widgets/media.html?src=https%3A%2F%2Fother.com')

    expect(unwrapEmbedly(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://cdn.embedly.com/widgets/other.html?src=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEmbedly(value)).toBeUndefined()
  })
})
