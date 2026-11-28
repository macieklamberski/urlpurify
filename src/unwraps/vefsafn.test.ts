import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapVefsafn } from './vefsafn.js'

describe('unwrapVefsafn', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://vefsafn.is/is/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapVefsafn] })).toBe(expected)
  })

  it('should extract the target from a snapshot on the wayback host', () => {
    const url = new URL(
      'http://wayback.vefsafn.is/wayback/20050622161649/http://www.example.is/page/ies_kraflafires',
    )

    expect(unwrapVefsafn(url)).toBe('http://www.example.is/page/ies_kraflafires')
  })

  it('should extract the target from a snapshot on the current host', () => {
    const url = new URL('https://vefsafn.is/is/20200221162928/http://www.example.is/2009/1/08')

    expect(unwrapVefsafn(url)).toBe('http://www.example.is/2009/1/08')
  })

  it('should extract the target from a mp_ snapshot on the current host', () => {
    const url = new URL(
      'https://vefsafn.is/is/20180916150400mp_/https://www.example.is/pdf/report.pdf',
    )

    expect(unwrapVefsafn(url)).toBe('https://www.example.is/pdf/report.pdf')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://wayback.vefsafn.is/wayback/20180209005307/http://www.example.com/2011/02/14/?p=1#comments',
    )

    expect(unwrapVefsafn(url)).toBe('http://www.example.com/2011/02/14/?p=1#comments')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('http://wayback.vefsafn.is/wayback/20050622161649/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const url = 'http://wayback.vefsafn.is/wayback/20050622161649/ftp://example.is/file.txt'

    expect(purifyUrl(url, { unwrappers: [unwrapVefsafn] })).toBe(url)
  })

  it('should return undefined for a partial timestamp on the wayback host', () => {
    const url = new URL('http://wayback.vefsafn.is/wayback/2005/http://www.example.is/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp on the current host', () => {
    const url = new URL('https://vefsafn.is/is/2020/http://www.example.is/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should return undefined for the legacy path on the current host', () => {
    const url = new URL('https://vefsafn.is/wayback/20050622161649/http://www.example.is/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should return undefined for the current path on the wayback host', () => {
    const url = new URL('http://wayback.vefsafn.is/is/20200221162928/http://www.example.is/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/wayback/20050622161649/http://www.example.is/')

    expect(unwrapVefsafn(url)).toBeUndefined()
  })

  it('should read the current replay on the www. host', () => {
    const value = new URL('https://www.vefsafn.is/is/20200101000000/https://example.com/')
    const expected = 'https://example.com/'

    expect(unwrapVefsafn(value)).toBe(expected)
  })
})
