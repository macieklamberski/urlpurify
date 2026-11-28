import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapTravelpayouts } from './travelpayouts.js'

describe('unwrapTravelpayouts', () => {
  it('should extract the target from the u param', () => {
    const value = new URL(
      'https://tp.media/r?marker=100001&trs=200002&p=4456&u=https%3A%2F%2Fwww.example.com%2FRestaurant_Review-g28970-Reviews-Cafe.html&campaign_id=149',
    )
    const expected = 'https://www.example.com/Restaurant_Review-g28970-Reviews-Cafe.html'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should extract the target when the u param comes first', () => {
    const value = new URL(
      'https://tp.media/r?u=https%3A%2F%2Fwww.example.com%2F&marker=100001&p=4456',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should extract a target without a path', () => {
    const value = new URL(
      'https://tp.media/r?campaign_id=84&marker=100001&p=2076&trs=200002&u=https%3A%2F%2Fexample.com&product_type=linkswitcher',
    )
    const expected = 'https://example.com'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://tp.media/r?marker=100001&p=4456&u=https%3A%2F%2Fwww.example.com%2Fsearch%3Fadults%3D2%26destination%3DRome',
    )
    const expected = 'https://www.example.com/search?adults=2&destination=Rome'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should not read the page_url param', () => {
    const value = new URL(
      'https://tp.media/r?marker=100001&p=4456&u=https%3A%2F%2Fwww.example.com%2F&promo_kind=tp_long&page_url=https%3A%2F%2Fexample.org%2Fpost%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should extract the target of a plain http wrapper', () => {
    const value = new URL('http://tp.media/r?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('https://tp.media/r?marker=100001&u=https://www.example.com/hotels/')
    const expected = 'https://www.example.com/hotels/'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should extract the target from the custom_url param', () => {
    const value = new URL(
      'http://c11.travelpayouts.com/click?shmarker=12446&promo_id=652&source_type=customlink&type=click&custom_url=https%3A%2F%2Fexperience.example.com%2Ftours%2F9431%3Fcurr%3DEUR',
    )
    const expected = 'https://experience.example.com/tours/9431?curr=EUR'

    expect(unwrapTravelpayouts(value)).toBe(expected)
  })

  it('should return undefined for the click path when custom_url is missing', () => {
    const value = new URL(
      'https://c11.travelpayouts.com/click?shmarker=12446&promo_id=652&source_type=customlink&type=click',
    )

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on a click host', () => {
    const value = new URL(
      'https://c11.travelpayouts.com/banner?custom_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a travelpayouts.com host outside the click family', () => {
    const value = new URL(
      'https://www.travelpayouts.com/click?custom_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with a click host', () => {
    const value = new URL(
      'https://a.c11.travelpayouts.com/click?custom_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a click host', () => {
    const value = new URL(
      'https://c11.travelpayouts.com.example.com/click?custom_url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined when the u param is missing', () => {
    const value = new URL('https://tp.media/r?marker=100001')

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const value = new URL('https://tp.media/r?marker=100001&u=')

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://tp.media/click?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with the redirect path', () => {
    const value = new URL('https://tp.media/r/x?marker=100001&u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/r?marker=100001&u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTravelpayouts(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapTravelpayouts)).toBe(true)
  })
})
