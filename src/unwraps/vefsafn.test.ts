import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapVefsafn } from './vefsafn.js'

describe('unwrapVefsafn', () => {
  it('should give http to a target without a scheme', () => {
    const value = 'https://vefsafn.is/is/20200101000000/www.example.com/page'
    const expected = 'http://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapVefsafn] })).toBe(expected)
  })

  it('should extract the target from a snapshot on the wayback host', () => {
    const value = new URL(
      'http://wayback.vefsafn.is/wayback/20050622161649/http://www.example.is/page/ies_kraflafires',
    )
    const expected = 'http://www.example.is/page/ies_kraflafires'

    expect(unwrapVefsafn(value)).toBe(expected)
  })

  it('should extract the target from a snapshot on the current host', () => {
    const value = new URL('https://vefsafn.is/is/20200221162928/http://www.example.is/2009/1/08')
    const expected = 'http://www.example.is/2009/1/08'

    expect(unwrapVefsafn(value)).toBe(expected)
  })

  it('should extract the target from a mp_ snapshot on the current host', () => {
    const value = new URL(
      'https://vefsafn.is/is/20180916150400mp_/https://www.example.is/pdf/report.pdf',
    )
    const expected = 'https://www.example.is/pdf/report.pdf'

    expect(unwrapVefsafn(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://wayback.vefsafn.is/wayback/20180209005307/http://www.example.com/2011/02/14/?p=1#comments',
    )
    const expected = 'http://www.example.com/2011/02/14/?p=1#comments'

    expect(unwrapVefsafn(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('http://wayback.vefsafn.is/wayback/20050622161649/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'http://wayback.vefsafn.is/wayback/20050622161649/ftp://example.is/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapVefsafn] })).toBe(value)
  })

  it('should return undefined for a partial timestamp on the wayback host', () => {
    const value = new URL('http://wayback.vefsafn.is/wayback/2005/http://www.example.is/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp on the current host', () => {
    const value = new URL('https://vefsafn.is/is/2020/http://www.example.is/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should return undefined for the legacy path on the current host', () => {
    const value = new URL('https://vefsafn.is/wayback/20050622161649/http://www.example.is/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should return undefined for the current path on the wayback host', () => {
    const value = new URL('http://wayback.vefsafn.is/is/20200221162928/http://www.example.is/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/wayback/20050622161649/http://www.example.is/')

    expect(unwrapVefsafn(value)).toBeUndefined()
  })

  it('should read the current replay on the www. host', () => {
    const value = new URL('https://www.vefsafn.is/is/20200101000000/https://example.com/')
    const expected = 'https://example.com/'

    expect(unwrapVefsafn(value)).toBe(expected)
  })
})
