import { describe, expect, it } from 'bun:test'
import { unwrapNlaWebarchive } from './nlaWebarchive.js'

describe('unwrapNlaWebarchive', () => {
  it('should extract target from an awa snapshot', () => {
    const url = new URL(
      'https://webarchive.nla.gov.au/awa/19991206141957/http://www.example.gov.au/about/publication_online.htm',
    )

    expect(unwrapNlaWebarchive(url)).toBe('http://www.example.gov.au/about/publication_online.htm')
  })

  it('should extract target from a gov snapshot', () => {
    const url = new URL(
      'http://webarchive.nla.gov.au/gov/20170224225955/http://www.example.gov.au/heritage/themes',
    )

    expect(unwrapNlaWebarchive(url)).toBe('http://www.example.gov.au/heritage/themes')
  })

  it('should extract target from a wayback snapshot', () => {
    const url = new URL(
      'https://webarchive.nla.gov.au/wayback/19970215064516/http://www.example.com.au/zan/regurg.htm',
    )

    expect(unwrapNlaWebarchive(url)).toBe('http://www.example.com.au/zan/regurg.htm')
  })

  it('should extract target from a mp_ snapshot', () => {
    const url = new URL(
      'https://web.archive.org.au/awa/20200605035409mp_/https://www.example.gov.au/sites/default/files/report.pdf',
    )

    expect(unwrapNlaWebarchive(url)).toBe(
      'https://www.example.gov.au/sites/default/files/report.pdf',
    )
  })

  it('should extract target from a Pandora replay snapshot', () => {
    const url = new URL(
      'http://pandora.nla.gov.au/nph-wb/20010220130000/http://www.example.edu.au/Articles/dec00/hase2.htm',
    )

    expect(unwrapNlaWebarchive(url)).toBe('http://www.example.edu.au/Articles/dec00/hase2.htm')
  })

  it('should return undefined for an archive collection on Pandora', () => {
    const url = new URL(
      'http://pandora.nla.gov.au/awa/20010220130000/http://www.example.edu.au/Articles/hase2.htm',
    )

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://web.archive.org.au/awa/20220302235108mp_/https://www.example.gov.au/file/10668/download?token=V5AKd-29#page=2',
    )

    expect(unwrapNlaWebarchive(url)).toBe(
      'https://www.example.gov.au/file/10668/download?token=V5AKd-29#page=2',
    )
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchive.nla.gov.au/awa/19991206141957/')

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://webarchive.nla.gov.au/awa/19991206141957/ftp://example.com/file')

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })

  it('should return undefined for a timestamp shorter than 14 digits', () => {
    const url = new URL('https://webarchive.nla.gov.au/awa/199912061419/http://www.example.gov.au/')

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })

  it('should return undefined for the url search', () => {
    const url = new URL(
      'http://webarchive.nla.gov.au/gov/search?mode=urlSearch&url=http://www.example.com/',
    )

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })

  it('should return undefined for a Pandora title snapshot', () => {
    const url = new URL(
      'http://pandora.nla.gov.au/pan/42197/20060526/www.example.com/http://www.example.org/a.pdf',
    )

    expect(unwrapNlaWebarchive(url)).toBeUndefined()
  })
})
