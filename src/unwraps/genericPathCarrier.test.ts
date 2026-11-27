import { describe, expect, it } from 'bun:test'
import { unwrapGenericPathCarrier } from './genericPathCarrier.js'

describe('unwrapGenericPathCarrier', () => {
  it('should extract a target glued after the host', () => {
    const value = new URL('https://city.example.com//www.example.org/embed/MLANv9VJ5Ws')
    const expected = 'https://www.example.org/embed/MLANv9VJ5Ws'

    expect(unwrapGenericPathCarrier(value)).toBe(expected)
  })

  it('should extract a target glued with a third slash', () => {
    const value = new URL('https://city.example.com///www.example.org/embed/MLANv9VJ5Ws')
    const expected = 'https://www.example.org/embed/MLANv9VJ5Ws'

    expect(unwrapGenericPathCarrier(value)).toBe(expected)
  })

  it('should extract a target glued behind the site directory', () => {
    const value = new URL('https://city.example.com/news//www.example.org/embed/MLANv9VJ5Ws')
    const expected = 'https://www.example.org/embed/MLANv9VJ5Ws'

    expect(unwrapGenericPathCarrier(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://needlework.example.com//maps.example.org/services/constructor/1.0/js/?sid=qMkqdbHN9XKY&width=800#map',
    )
    const expected =
      'https://maps.example.org/services/constructor/1.0/js/?sid=qMkqdbHN9XKY&width=800#map'

    expect(unwrapGenericPathCarrier(value)).toBe(expected)
  })

  it('should return undefined for a url carried after a scheme in the path', () => {
    const value = new URL(
      'https://archive.example.com/web/20200101000000/https://www.example.org/post/',
    )

    expect(unwrapGenericPathCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a url carried after an escaped scheme in the path', () => {
    const value = new URL(
      'https://archive.example.com/web/20200101000000/https%3A//www.example.org/post/',
    )

    expect(unwrapGenericPathCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a host behind a single slash', () => {
    const value = new URL('https://cache.example.com/c/s/www.example.org/post/')

    expect(unwrapGenericPathCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a run of slashes before a path of the site', () => {
    const value = new URL('https://www.example.com//wp-content/uploads/2026/01/photo.jpg')

    expect(unwrapGenericPathCarrier(value)).toBeUndefined()
  })

  it('should return undefined for a host in the query', () => {
    const value = new URL('https://www.example.com/go?to=//www.example.org/post/')

    expect(unwrapGenericPathCarrier(value)).toBeUndefined()
  })

  it('should scan a long run of slashes in linear time', () => {
    const value = new URL(`https://www.example.com/${'/'.repeat(200000)}`)
    const start = performance.now()

    unwrapGenericPathCarrier(value)

    expect(performance.now() - start).toBeLessThan(1000)
  })

  it('should scan a long path in linear time', () => {
    const value = new URL(`https://www.example.com${'/a'.repeat(100000)}//`)
    const start = performance.now()

    unwrapGenericPathCarrier(value)

    expect(performance.now() - start).toBeLessThan(1000)
  })
})
