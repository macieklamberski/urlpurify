import { describe, expect, it } from 'bun:test'
import { unwrapStay22 } from './stay22.js'

describe('unwrapStay22', () => {
  it('should extract the target of a booking link', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&campaign=examplepublisher-thingstodoinprague&product=lma&habl=false&isinc=false&sid22=51ba062e-dc18-494e-849a-76fb5abf2131&source=direct&medium=deeplink&address=Prague%2C+Czechia&link=https%3A%2F%2Fwww.example.com%2Fhotel%2Fcz%2Fexample-hotel.html',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/hotel/cz/example-hotel.html')
  })

  it('should extract the target of an expedia link with the link param last', () => {
    const url = new URL(
      'https://www.stay22.com/allez/expedia?campaign=michoacan-tours&aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2FSan-Felipe-Hotels.h66198.Hotel-Information',
    )

    expect(unwrapStay22(url)).toBe(
      'https://www.example.com/San-Felipe-Hotels.h66198.Hotel-Information',
    )
  })

  it('should extract the target of a link whose provider has no separator', () => {
    const url = new URL(
      'https://www.stay22.com/allez/hotelscom?campaign=tuscanfarmstay&aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2FHotel-Search',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/Hotel-Search')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://www.stay22.com/allez/hotelscom?campaign=tuscanfarmstay&aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2FHotel-Search%3Fadults%3D2%26d1%3D2023-09-01%26destination%3DTuscany%252C%2520Italy',
    )

    expect(unwrapStay22(url)).toBe(
      'https://www.example.com/Hotel-Search?adults=2&d1=2023-09-01&destination=Tuscany%2C%20Italy',
    )
  })

  it('should extract the target of a link with a hyphen in the provider', () => {
    const url = new URL(
      'https://www.stay22.com/allez/get-your-guide?aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2Ftour-t1%2F',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/tour-t1/')
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL(
      'https://booking.stay22.com/allez/booking?link=https%3A%2F%2Fwww.example.com%2Fpage',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL(
      'http://www.stay22.com/allez/booking?aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=https%253A%252F%252Fwww.example.com%252F%253Faid%253D1%2526no_rooms%253D1',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/?aid=1&no_rooms=1')
  })

  it('should extract a target encoded twice with lowercase hex digits', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=https%253a%252f%252fwww.example.com%252f',
    )

    expect(unwrapStay22(url)).toBe('https://www.example.com/')
  })

  it('should keep an encoded url inside the query of the target', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=https%3A%2F%2Fwww.example.com%2F%3Fredirect%3Dhttps%253A%252F%252Fwww.example.org%252F',
    )

    expect(unwrapStay22(url)).toBe(
      'https://www.example.com/?redirect=https%3A%2F%2Fwww.example.org%2F',
    )
  })

  it('should return undefined for a twice-encoded target that fails to decode', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=https%253A%252F%252Fexample.com%252F%25E0',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined when the link param is missing', () => {
    const url = new URL(
      'https://www.stay22.com/allez/roam?aid=examplepublisher&ref22=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined when the link param is empty', () => {
    const url = new URL('https://www.stay22.com/allez/booking?aid=examplepublisher&link=')

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=ftp%3A%2F%2Fexample.com%2Ffile.zip',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL(
      'https://www.stay22.com/out?url=https%3A%2F%2Fwww.example.com%2F&link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for the allez path with a deeper segment', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking/extra?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for the allez path with an empty provider', () => {
    const url = new URL('https://www.stay22.com/allez/?link=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for the allez path without a provider', () => {
    const url = new URL('https://www.stay22.com/allez?link=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for a path that only ends with the allez path', () => {
    const url = new URL(
      'https://www.stay22.com/x/allez/booking?link=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://www.example.com/allez/booking?link=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://www.notstay22.com/allez/booking?link=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain in its name', () => {
    const url = new URL(
      'https://stay22.com.example.net/allez/booking?link=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapStay22(url)).toBeUndefined()
  })

  it('should extract a plain http target encoded twice', () => {
    const url = new URL(
      'https://www.stay22.com/allez/booking?aid=examplepublisher&link=http%253A%252F%252Fwww.example.com%252F',
    )

    expect(unwrapStay22(url)).toBe('http://www.example.com/')
  })
})
