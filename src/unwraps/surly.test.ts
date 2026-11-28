import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapSurly } from './surly.js'

describe('unwrapSurly', () => {
  it('should drop a space before the target host', () => {
    const value = 'https://sur.ly/o/%20www.example.com/page/AA000001'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapSurly] })).toBe(expected)
  })

  it('should extract a target before the partner id', () => {
    const value = new URL('http://sur.ly/o/example.com/AA044639')
    const expected = 'https://example.com'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should decode an encoded target before the partner id', () => {
    const value = new URL(
      'http://sur.ly/o/example.com/doclib%2Fgetdoc.aspx%3Ffunc%3Dll%26objid%3D9792178%26objaction%3Ddownload/AA001290',
    )
    const expected =
      'https://example.com/doclib/getdoc.aspx?func=ll&objid=9792178&objaction=download'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should extract a target without a partner id', () => {
    const value = new URL('https://sur.ly/o/example.com/')
    const expected = 'https://example.com/'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should extract a target path without a partner id', () => {
    const value = new URL('http://sur.ly/o/example.com/paracinnekretnine')
    const expected = 'https://example.com/paracinnekretnine'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should keep an escape cut short in the target as written', () => {
    const value = new URL('http://sur.ly/o/example.com/doclib%2/AA001290')
    const expected = 'https://example.com/doclib%2'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should keep the wrapper for a target host that does not parse', () => {
    const value = 'http://sur.ly/o/example.com%25/AA001290'

    expect(purifyUrl(value, { unwrappers: [unwrapSurly] })).toBe(value)
  })

  it('should return undefined for the partner id with no target', () => {
    const value = new URL('http://sur.ly/o//AA001290')

    expect(unwrapSurly(value)).toBeUndefined()
  })

  it('should return undefined for the site info page', () => {
    const value = new URL('https://sur.ly/i/example.com/')

    expect(unwrapSurly(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/o/example.org/AA044639')

    expect(unwrapSurly(value)).toBeUndefined()
  })

  it('should drop the scheme of a target that keeps it', () => {
    const value = new URL('https://www.sur.ly/o/http://www.flipadvisor101.com')
    const expected = 'https://www.flipadvisor101.com'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should keep a scheme inside the target', () => {
    const value = new URL('https://sur.ly/o/example.com/go%3Fu%3Dhttp%3A%2F%2Fexample.org/AA000014')
    const expected = 'https://example.com/go?u=http://example.org'

    expect(unwrapSurly(value)).toBe(expected)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL('http://sur.ly/o/example.com/AA044639%23top')
    const expected = 'https://example.com/AA044639#top'

    expect(unwrapSurly(value)).toBe(expected)
  })
})
