import { describe, expect, it } from 'bun:test'
import { unwrapCiscoSecureWeb } from './ciscoSecureWeb.js'

describe('unwrapCiscoSecureWeb', () => {
  it('should extract an https target', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1ZW75xkji42hMk4mZyb2pincAC6Vrf37jEZ_P_39tvHFfFcIu5JU5jqXmM-_Omy1xtsU5y2BlNTY6FnMIP6Co3sqGwJEK7mDgQJk8Zn5Q8DBv3LeVZ/https%3A%2F%2Fwww.example.com%2Fcreators%2Fexample-show',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://www.example.com/creators/example-show')
  })

  it('should extract an http target', () => {
    const url = new URL(
      'http://secure-web.cisco.com/1GJ1ycFUjQWn_4l_DZ-SkJ5d9U3lhNo8d/http%3A%2F%2Fwww.example.org%2Fwp-content%2Fuploads%2F2021%2F01%2Fbrief.pdf',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe(
      'http://www.example.org/wp-content/uploads/2021/01/brief.pdf',
    )
  })

  it('should extract a target with lowercase hex', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1m2i0zyfcw/https%3a%2f%2fwww.example.com%2freports%2f6431%2ffile.html%3fidu%3d1',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://www.example.com/reports/6431/file.html?idu=1')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2%23results',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://example.com/search?q=feeds&page=2#results')
  })

  it('should keep a percent sign escaped in the target', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D100%2525',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://example.com/search?q=100%25')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1YRgklg0XBMr4hOhxT5aQ7zBCDkk7fd6/https%253A%252F%252Fexample.com%252Fwp-content%252Fuploads%252Fposter.pdf',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://example.com/wp-content/uploads/poster.pdf')
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1YRgklg0XBMr4hOhxT5aQ7zBCDkk7fd6/https%253A%252F%252Fexample.com%252F100%25',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://example.com/100%')
  })

  it('should drop a query the publisher added to the wrapper', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2Frecall.pdf?ref=example.org',
    )

    expect(unwrapCiscoSecureWeb(url)).toBe('https://example.com/recall.pdf')
  })

  it('should return undefined when the target segment is missing', () => {
    const url = new URL('https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy')

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined when the target segment is empty', () => {
    const url = new URL('https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/')

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/ftp%3A%2F%2Fexample.com%2Ffile.zip',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a target without the slashes of a url', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%253Aexample.com',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a target without a host', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2F',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a target with malformed escapes', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2F%E3%81',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for another path shape on the host', () => {
    const url = new URL(
      'https://www.cisco.com/c/en/us/support/index.html?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a path with more than one segment after the token', () => {
    const url = new URL(
      'https://secure-web.cisco.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com/extra',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'https://example.com/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })

  it('should return undefined for a path with a segment before the token', () => {
    const url = new URL(
      'https://secure-web.cisco.com/c/1FUSlj3K3QVkKY875RHGJXaTEmxvyRjzy/https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapCiscoSecureWeb(url)).toBeUndefined()
  })
})
