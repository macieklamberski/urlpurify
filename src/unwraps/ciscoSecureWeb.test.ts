import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapCiscoSecureWeb } from './ciscoSecureWeb.js'

describe('unwrapCiscoSecureWeb', () => {
  it('should extract an https target', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1ZW75xkji42hMk4mZyb2pincAC6Vrf37jEZ_P_39tvHFfFcIu5JU5jqXmM-_Omy1xtsU5y2BlNTY6FnMIP6Co3sqGwJEK7mDgQJk8Zn5Q8DBv3LeVZ/https%3A%2F%2Fwww.example.com%2Fcreators%2Fexample-show',
    )
    const expected = 'https://www.example.com/creators/example-show'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should extract an http target', () => {
    const value = new URL(
      'http://secure-web.cisco.com/1GJ1ycFUjQWn_4l_DZ-SkJ5d9U3lhNo8d/http%3A%2F%2Fwww.example.org%2Fwp-content%2Fuploads%2F2021%2F01%2Fbrief.pdf',
    )
    const expected = 'http://www.example.org/wp-content/uploads/2021/01/brief.pdf'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should extract a target with lowercase hex', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1m2i0zyfcw/https%3a%2f%2fwww.example.com%2freports%2f6431%2ffile.html%3fidu%3d1',
    )
    const expected = 'https://www.example.com/reports/6431/file.html?idu=1'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2%23results',
    )
    const expected = 'https://example.com/search?q=feeds&page=2#results'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should keep a percent sign escaped in the target', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D100%2525',
    )
    const expected = 'https://example.com/search?q=100%25'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1YRgklg0XBMr4hOhxT5aQ7zBCDkk7fd6/https%253A%252F%252Fexample.com%252Fwp-content%252Fuploads%252Fposter.pdf',
    )
    const expected = 'https://example.com/wp-content/uploads/poster.pdf'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1YRgklg0XBMr4hOhxT5aQ7zBCDkk7fd6/https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should drop a query the publisher added to the wrapper', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Frecall.pdf?ref=example.org',
    )
    const expected = 'https://example.com/recall.pdf'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should return undefined when the target segment is missing', () => {
    const value = new URL('https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy')

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined when the target segment is empty', () => {
    const value = new URL('https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/')

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/ftp%3A%2F%2Fexample.com%2Ffile.zip',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined for a target without the slashes of a url', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%253Aexample.com',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should keep the wrapper for a target without a host', () => {
    const value = 'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2F'

    expect(purifyUrl(value, { unwrappers: [unwrapCiscoSecureWeb] })).toBe(value)
  })

  it('should keep an escape cut short in the target as written', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2F%E3%81',
    )
    const expected = 'https://example.com/%E3%81'

    expect(unwrapCiscoSecureWeb(value)).toBe(expected)
  })

  it('should return undefined for another path shape on the host', () => {
    const value = new URL(
      'https://www.cisco.com/c/en/us/support/index.html?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined for a path with more than one segment after the token', () => {
    const value = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com/extra',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://example.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })

  it('should return undefined for a path with a segment before the token', () => {
    const value = new URL(
      'https://secure-web.cisco.com/c/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCiscoSecureWeb(value)).toBeUndefined()
  })
})
