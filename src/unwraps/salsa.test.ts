import { describe, expect, it } from 'bun:test'
import { unwrapSalsa } from './salsa.js'

describe('unwrapSalsa', () => {
  it('should extract the target from the dia track path', () => {
    const value = new URL(
      'https://org.salsalabs.com/dia/track.jsp?key=-1&url_num=5&url=http%3A%2F%2Fwww.example.net%2Fcontent%2F14%2F1%2F17%2Fabstract',
    )
    const expected = 'http://www.example.net/content/14/1/17/abstract'

    expect(unwrapSalsa(value)).toBe(expected)
  })

  it('should extract the target from the salsa track path on a sender host', () => {
    const value = new URL(
      'http://action.example.org/salsa/track.jsp?v=2&c=Wnbk&url=https%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3DSn0pNK',
    )
    const expected = 'https://www.example.com/watch?v=Sn0pNK'

    expect(unwrapSalsa(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://action.example.org/salsa/track.jsp?key=-1&url=https://www.example.com/search/a+b',
    )
    const expected = 'https://www.example.com/search/a+b'

    expect(unwrapSalsa(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://org.salsalabs.com/dia/track.jsp?key=-1&url=javascript%3Aalert(1)',
    )

    expect(unwrapSalsa(value)).toBeUndefined()
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://org.salsalabs.com/dia/track.jsp?key=-1&url_num=5')

    expect(unwrapSalsa(value)).toBeUndefined()
  })

  it('should return undefined for a path that only ends with the track path', () => {
    const value = new URL('https://example.org/x/dia/track.jsp?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapSalsa(value)).toBeUndefined()
  })
})
