import { describe, expect, it } from 'bun:test'
import { unwrapVefsafn } from './vefsafn.js'

describe('unwrapVefsafn', () => {
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

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://wayback.vefsafn.is/wayback/20050622161649/ftp://example.is/file.txt',
    )

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
})
