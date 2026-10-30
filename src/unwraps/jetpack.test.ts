import { describe, expect, it } from 'bun:test'
import { unwrapJetpack } from './jetpack.js'

describe('unwrapJetpack', () => {
  it('should extract the source without its scheme', () => {
    const value = new URL('https://i0.wp.com/cdn.example.com/wp-content/uploads/photo.jpg')
    const expected = 'cdn.example.com/wp-content/uploads/photo.jpg'

    expect(unwrapJetpack(value)).toBe(expected)
  })

  it('should drop the resize options', () => {
    const value = new URL('https://i2.wp.com/cdn.example.com/photo.jpg?resize=840%2C473&ssl=1')
    const expected = 'cdn.example.com/photo.jpg'

    expect(unwrapJetpack(value)).toBe(expected)
  })

  it('should decode an encoded source path', () => {
    const value = new URL('https://i1.wp.com/cdn.example.com/caf%C3%A9.jpg')
    const expected = 'cdn.example.com/café.jpg'

    expect(unwrapJetpack(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://i0.wp.com/')

    expect(unwrapJetpack(value)).toBeUndefined()
  })

  it('should return undefined for a host outside the numbered family', () => {
    const value = new URL('https://i4.wp.com/cdn.example.com/photo.jpg')

    expect(unwrapJetpack(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in a numbered host', () => {
    const value = new URL('https://xi0.wp.com/cdn.example.com/photo.jpg')

    expect(unwrapJetpack(value)).toBeUndefined()
  })
})
