import { describe, expect, it } from 'bun:test'
import { unwrapSalsa } from './salsa.js'

describe('unwrapSalsa', () => {
  it('should extract the target from the dia track path', () => {
    const url = new URL(
      'https://org.salsalabs.com/dia/track.jsp?key=-1&url_num=5&url=http%3A%2F%2Fwww.example.net%2Fcontent%2F14%2F1%2F17%2Fabstract',
    )

    expect(unwrapSalsa(url)).toBe('http://www.example.net/content/14/1/17/abstract')
  })

  it('should extract the target from the salsa track path on a sender host', () => {
    const url = new URL(
      'http://action.example.org/salsa/track.jsp?v=2&c=Wnbk&url=https%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3DSn0pNK',
    )

    expect(unwrapSalsa(url)).toBe('https://www.example.com/watch?v=Sn0pNK')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://action.example.org/salsa/track.jsp?key=-1&url=https://www.example.com/search/a+b',
    )

    expect(unwrapSalsa(url)).toBe('https://www.example.com/search/a+b')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://org.salsalabs.com/dia/track.jsp?key=-1&url=javascript%3Aalert(1)')

    expect(unwrapSalsa(url)).toBeUndefined()
  })

  it('should return undefined when the url param is missing', () => {
    const url = new URL('https://org.salsalabs.com/dia/track.jsp?key=-1&url_num=5')

    expect(unwrapSalsa(url)).toBeUndefined()
  })

  it('should return undefined for a path that only ends with the track path', () => {
    const url = new URL('https://example.org/x/dia/track.jsp?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapSalsa(url)).toBeUndefined()
  })
})
