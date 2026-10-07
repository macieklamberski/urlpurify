import { describe, expect, it } from 'bun:test'
import { unwrapSurly } from './surly.js'

describe('unwrapSurly', () => {
  it('should extract a target before the partner id', () => {
    const url = new URL('http://sur.ly/o/example.com/AA044639')

    expect(unwrapSurly(url)).toBe('https://example.com')
  })

  it('should decode an encoded target before the partner id', () => {
    const url = new URL(
      'http://sur.ly/o/example.com/doclib%2Fgetdoc.aspx%3Ffunc%3Dll%26objid%3D9792178%26objaction%3Ddownload/AA001290',
    )

    expect(unwrapSurly(url)).toBe(
      'https://example.com/doclib/getdoc.aspx?func=ll&objid=9792178&objaction=download',
    )
  })

  it('should extract a target without a partner id', () => {
    const url = new URL('https://sur.ly/o/example.com/')

    expect(unwrapSurly(url)).toBe('https://example.com/')
  })

  it('should extract a target path without a partner id', () => {
    const url = new URL('http://sur.ly/o/example.com/paracinnekretnine')

    expect(unwrapSurly(url)).toBe('https://example.com/paracinnekretnine')
  })

  it('should return undefined for a target cut short inside an escape', () => {
    const url = new URL('http://sur.ly/o/example.com/doclib%2/AA001290')

    expect(unwrapSurly(url)).toBeUndefined()
  })

  it('should return undefined for a target host that does not parse', () => {
    const url = new URL('http://sur.ly/o/example.com%25/AA001290')

    expect(unwrapSurly(url)).toBeUndefined()
  })

  it('should return undefined for the partner id with no target', () => {
    const url = new URL('http://sur.ly/o//AA001290')

    expect(unwrapSurly(url)).toBeUndefined()
  })

  it('should return undefined for the site info page', () => {
    const url = new URL('https://sur.ly/i/example.com/')

    expect(unwrapSurly(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/o/example.org/AA044639')

    expect(unwrapSurly(url)).toBeUndefined()
  })

  it('should drop the scheme of a target that keeps it', () => {
    const url = new URL('https://www.sur.ly/o/http://www.flipadvisor101.com')

    expect(unwrapSurly(url)).toBe('https://www.flipadvisor101.com')
  })

  it('should keep a scheme inside the target', () => {
    const url = new URL('https://sur.ly/o/example.com/go%3Fu%3Dhttp%3A%2F%2Fexample.org/AA000014')

    expect(unwrapSurly(url)).toBe('https://example.com/go?u=http://example.org')
  })
})
