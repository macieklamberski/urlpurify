import { describe, expect, it } from 'bun:test'
import { unwrapWeserv } from './weserv.js'

describe('unwrapWeserv', () => {
  it('should extract an encoded source', () => {
    const value = new URL('https://wsrv.nl/?url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg&w=200')
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should extract a source on the legacy host', () => {
    const value = new URL('https://images.weserv.nl/?w=200&url=https://cdn.example.com/photo.jpg')
    const expected = 'https://cdn.example.com/photo.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should keep a raw plus in the source', () => {
    const value = new URL('https://wsrv.nl/?url=https://cdn.example.com/C++_logo.png')
    const expected = 'https://cdn.example.com/C++_logo.png'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should give https to a source with the ssl prefix', () => {
    const value = new URL('https://images.weserv.nl/?url=ssl:cdn.example.com/photo.png')
    const expected = 'https://cdn.example.com/photo.png'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should return a source without a scheme as a host', () => {
    const value = new URL('https://images.weserv.nl/?url=cdn.example.com%2Fuploads%2Fphoto.jpg')
    const expected = 'cdn.example.com/uploads/photo.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should resolve a path source against the proxy', () => {
    const value = new URL('https://wsrv.nl/?url=/images/photo.jpg')
    const expected = 'https://wsrv.nl/images/photo.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should decode the source once', () => {
    const value = new URL(
      'https://wsrv.nl/?url=https://cdn.example.com/2026%252F04/photo.jpg&w=300',
    )
    const expected = 'https://cdn.example.com/2026%2F04/photo.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should cut an unencoded source at its first ampersand', () => {
    const value = new URL('https://wsrv.nl/?url=https://cdn.example.com/photo.jpg?v=2&w=300')
    const expected = 'https://cdn.example.com/photo.jpg?v=2'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should read the last url param', () => {
    const value = new URL(
      'https://wsrv.nl/?url=https://cdn.example.com/a.jpg&url=https://cdn.example.com/b.jpg',
    )
    const expected = 'https://cdn.example.com/b.jpg'

    expect(unwrapWeserv(value)).toBe(expected)
  })

  it('should return undefined without a source', () => {
    const value = new URL('https://images.weserv.nl/')

    expect(unwrapWeserv(value)).toBeUndefined()
  })

  it('should return undefined for another path on the proxy', () => {
    const value = new URL('https://wsrv.nl/docs/?url=https://cdn.example.com/photo.jpg')

    expect(unwrapWeserv(value)).toBeUndefined()
  })
})
