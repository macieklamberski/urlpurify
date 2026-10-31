import { describe, expect, it } from 'bun:test'
import { unwrapBrightspot } from './brightspot.js'

describe('unwrapBrightspot', () => {
  it('should extract an encoded source', () => {
    const value = new URL(
      'https://npr.brightspotcdn.com/dims4/default/f008/2147483647/resize/300x169!/quality/90/?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapBrightspot(value)).toBe(expected)
  })

  it('should extract the source from a dims3 path', () => {
    const value = new URL(
      'https://ewscripps.brightspotcdn.com/dims3/default/89f2c9d/2147483647/resize/1280x720!/?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapBrightspot(value)).toBe(expected)
  })

  it('should keep a raw plus in the source', () => {
    const value = new URL(
      'https://npr.brightspotcdn.com/dims4/default/f008/?url=https%3A%2F%2Fcdn.example.com%2FC++_logo.png',
    )
    const expected = 'https://cdn.example.com/C++_logo.png'

    expect(unwrapBrightspot(value)).toBe(expected)
  })

  it('should decode a source cut off inside an escape', () => {
    const value = new URL(
      'https://ca-times.brightspotcdn.com/dims4/default/e808710/?url=https%3A%2F%2Fcdn.example.com%2F88%2F29%2',
    )
    const expected = 'https://cdn.example.com/88/29%2'

    expect(unwrapBrightspot(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://npr.brightspotcdn.com/dims4/default/f008/')

    expect(unwrapBrightspot(value)).toBeUndefined()
  })

  it('should return undefined for another path on the resizer', () => {
    const value = new URL(
      'https://npr.brightspotcdn.com/assets/?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )

    expect(unwrapBrightspot(value)).toBeUndefined()
  })

  it('should extract the source on a publisher domain', () => {
    const value = new URL(
      'https://dims.apnews.com/dims4/default/8b9a0c1/2147483647/strip/true/crop/3000x2000+0+0/resize/1440x960!/quality/90/?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg',
    )
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapBrightspot(value)).toBe(expected)
  })

  it('should return undefined for a source that is not an http url', () => {
    const value = new URL('https://example.com/dims4/report/?url=quarterly-results')

    expect(unwrapBrightspot(value)).toBeUndefined()
  })
})
