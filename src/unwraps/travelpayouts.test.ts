import { describe, expect, it } from 'bun:test'
import { unwrapTravelpayouts } from './travelpayouts.js'

describe('unwrapTravelpayouts', () => {
  it('should extract the target from the u param', () => {
    const url = new URL(
      'https://tp.media/r?marker=100001&trs=200002&p=4456&u=https%3A%2F%2Fwww.example.com%2FRestaurant_Review-g28970-Reviews-Cafe.html&campaign_id=149',
    )

    expect(unwrapTravelpayouts(url)).toBe(
      'https://www.example.com/Restaurant_Review-g28970-Reviews-Cafe.html',
    )
  })

  it('should extract the target when the u param comes first', () => {
    const url = new URL(
      'https://tp.media/r?u=https%3A%2F%2Fwww.example.com%2F&marker=100001&p=4456',
    )

    expect(unwrapTravelpayouts(url)).toBe('https://www.example.com/')
  })

  it('should extract a target without a path', () => {
    const url = new URL(
      'https://tp.media/r?campaign_id=84&marker=100001&p=2076&trs=200002&u=https%3A%2F%2Fexample.com&product_type=linkswitcher',
    )

    expect(unwrapTravelpayouts(url)).toBe('https://example.com')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://tp.media/r?marker=100001&p=4456&u=https%3A%2F%2Fwww.example.com%2Fsearch%3Fadults%3D2%26destination%3DRome',
    )

    expect(unwrapTravelpayouts(url)).toBe(
      'https://www.example.com/search?adults=2&destination=Rome',
    )
  })

  it('should not read the page_url param', () => {
    const url = new URL(
      'https://tp.media/r?marker=100001&p=4456&u=https%3A%2F%2Fwww.example.com%2F&promo_kind=tp_long&page_url=https%3A%2F%2Fexample.org%2Fpost%2F',
    )

    expect(unwrapTravelpayouts(url)).toBe('https://www.example.com/')
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL('http://tp.media/r?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(url)).toBe('https://www.example.com/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://tp.media/r?marker=100001&u=https://www.example.com/hotels/')

    expect(unwrapTravelpayouts(url)).toBe('https://www.example.com/hotels/')
  })

  it('should extract the target from a subdomain no specimen shows', () => {
    const url = new URL('https://www.tp.media/r?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(url)).toBe('https://www.example.com/')
  })

  it('should return undefined when the u param is missing', () => {
    const url = new URL('https://tp.media/r?marker=100001')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const url = new URL('https://tp.media/r?marker=100001&u=')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://tp.media/click?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the redirect path', () => {
    const url = new URL('https://tp.media/r/x?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/r?marker=100001&u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://notp.media/r?marker=100001&u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for a host that replaces the dot with another character', () => {
    const url = new URL('https://www.tp-media/r?marker=100001&u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain in its name', () => {
    const url = new URL(
      'https://tp.media.example.net/r?marker=100001&u=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTravelpayouts(url)).toBeUndefined()
  })
})
