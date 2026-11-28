import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapNlaWebarchive } from './nlaWebarchive.js'

describe('unwrapNlaWebarchive', () => {
  it('should give http to a target without a scheme', () => {
    const value = 'https://webarchive.nla.gov.au/awa/20200101000000/www.example.com/page'
    const expected = 'http://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapNlaWebarchive] })).toBe(expected)
  })

  it('should extract target from an awa snapshot', () => {
    const value = new URL(
      'https://webarchive.nla.gov.au/awa/19991206141957/http://www.example.gov.au/about/publication_online.htm',
    )
    const expected = 'http://www.example.gov.au/about/publication_online.htm'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should extract target from a gov snapshot', () => {
    const value = new URL(
      'http://webarchive.nla.gov.au/gov/20170224225955/http://www.example.gov.au/heritage/themes',
    )
    const expected = 'http://www.example.gov.au/heritage/themes'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should extract target from a wayback snapshot', () => {
    const value = new URL(
      'https://webarchive.nla.gov.au/wayback/19970215064516/http://www.example.com.au/zan/regurg.htm',
    )
    const expected = 'http://www.example.com.au/zan/regurg.htm'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should extract target from a mp_ snapshot', () => {
    const value = new URL(
      'https://web.archive.org.au/awa/20200605035409mp_/https://www.example.gov.au/sites/default/files/report.pdf',
    )
    const expected = 'https://www.example.gov.au/sites/default/files/report.pdf'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should extract target from a Pandora replay snapshot', () => {
    const value = new URL(
      'http://pandora.nla.gov.au/nph-wb/20010220130000/http://www.example.edu.au/Articles/dec00/hase2.htm',
    )
    const expected = 'http://www.example.edu.au/Articles/dec00/hase2.htm'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should return undefined for a Pandora replay timestamp shorter than 14 digits', () => {
    const value = new URL(
      'http://pandora.nla.gov.au/nph-wb/200102201300/http://www.example.edu.au/',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should add the http scheme to a Pandora title snapshot target', () => {
    const value = new URL(
      'http://pandora.nla.gov.au/pan/21336/20031011-0000/www.example.gov.au/creative.nation/contents.html',
    )
    const expected = 'http://www.example.gov.au/creative.nation/contents.html'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should add the http scheme to a Pandora title snapshot dated without a time', () => {
    const value = new URL('http://pandora.nla.gov.au/pan/42197/20040527/www.example.com/acag.html')
    const expected = 'http://www.example.com/acag.html'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should return undefined for a Pandora title snapshot file outside a host folder', () => {
    const value = new URL('http://pandora.nla.gov.au/pan/21336/20031011-0000/images/banner.gif')

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should return undefined for a Pandora title snapshot with a partial date', () => {
    const value = new URL(
      'http://pandora.nla.gov.au/pan/21336/2003/www.example.gov.au/contents.html',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should return undefined for the Pandora title snapshot path on another host', () => {
    const value = new URL(
      'http://webarchive.nla.gov.au/pan/21336/20031011-0000/www.example.gov.au/contents.html',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should return undefined for an archive collection on Pandora', () => {
    const value = new URL(
      'http://pandora.nla.gov.au/awa/20010220130000/http://www.example.edu.au/Articles/hase2.htm',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://web.archive.org.au/awa/20220302235108mp_/https://www.example.gov.au/file/10668/download?token=V5AKd-29#page=2',
    )
    const expected = 'https://www.example.gov.au/file/10668/download?token=V5AKd-29#page=2'

    expect(unwrapNlaWebarchive(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchive.nla.gov.au/awa/19991206141957/')

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://webarchive.nla.gov.au/awa/19991206141957/ftp://example.com/file'

    expect(purifyUrl(value, { unwrappers: [unwrapNlaWebarchive] })).toBe(value)
  })

  it('should return undefined for a timestamp shorter than 14 digits', () => {
    const value = new URL(
      'https://webarchive.nla.gov.au/awa/199912061419/http://www.example.gov.au/',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })

  it('should return undefined for the url search', () => {
    const value = new URL(
      'http://webarchive.nla.gov.au/gov/search?mode=urlSearch&url=http://www.example.com/',
    )

    expect(unwrapNlaWebarchive(value)).toBeUndefined()
  })
})
