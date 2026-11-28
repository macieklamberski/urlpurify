import { describe, expect, it } from 'bun:test'
import { unwrapUcoz } from './ucoz.js'

describe('unwrapUcoz', () => {
  it('should extract a target glued onto the site host', () => {
    const value = new URL('https://city-site.ucoz.com//www.example.org/embed/MLANv9VJ5Ws')
    const expected = 'https://www.example.org/embed/MLANv9VJ5Ws'

    expect(unwrapUcoz(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://crafts-site.ucoz.ua//maps.example.org/services/constructor/1.0/js/?sid=qMkqdbHN9XKY&width=800#map',
    )
    const expected =
      'https://maps.example.org/services/constructor/1.0/js/?sid=qMkqdbHN9XKY&width=800#map'

    expect(unwrapUcoz(value)).toBe(expected)
  })

  it('should extract a target on a site host of another uCoz domain', () => {
    const value = new URL('https://army-site.do.am//www.example.org/embed/2Ya2jWz6KM8')
    const expected = 'https://www.example.org/embed/2Ya2jWz6KM8'

    expect(unwrapUcoz(value)).toBe(expected)
  })

  it('should return undefined for a path of the site', () => {
    const value = new URL('https://city-site.ucoz.com/news/2026-01-01-1')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for a host behind a single slash', () => {
    const value = new URL('https://city-site.ucoz.com/www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for a run of slashes before a path of the site', () => {
    const value = new URL('https://city-site.ucoz.com//load/files/photo.jpg')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for a target glued behind a directory', () => {
    const value = new URL('https://city-site.ucoz.com/news//www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com//www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://site.exampleucoz.ru//www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should return undefined for a subdomain named ucoz on another site', () => {
    const value = new URL('https://ucoz.example.com//www.example.org/embed/MLANv9VJ5Ws')

    expect(unwrapUcoz(value)).toBeUndefined()
  })

  it('should scan a long run of slashes in linear time', () => {
    const value = new URL(`https://city-site.ucoz.com/${'/'.repeat(200000)}`)
    const start = performance.now()

    unwrapUcoz(value)

    expect(performance.now() - start).toBeLessThan(1000)
  })
})
