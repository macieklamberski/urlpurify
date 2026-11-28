import { describe, expect, it } from 'bun:test'
import { unwrapIndexHu } from './indexHu.js'

describe('unwrapIndexHu', () => {
  it('should extract target from a dex.hu link', () => {
    const value = new URL(
      'https://dex.hu/x.php?id=index_gazdasag_cikklink&url=https%3A%2F%2Fwww.example.com%2Fkozelet%2F2015%2F03%2Fhir-szovege%2F',
    )
    const expected = 'https://www.example.com/kozelet/2015/03/hir-szovege/'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://dex.hu/x.php?id=index_tech_cikklink&url=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2',
    )
    const expected = 'https://example.com/search?q=feeds&page=2'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should extract target when the url param comes first', () => {
    const value = new URL(
      'https://dex.hu/x.php?url=https%3A%2F%2Fexample.com%2F&id=index_tech_cikklink',
    )
    const expected = 'https://example.com/'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://dex.hu/x.php?id=index_gazdasag_cikklink')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://dex.hu/x.php?id=index_gazdasag_cikklink&url=')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined when the target is in the id param', () => {
    const value = new URL('https://dex.hu/x.php?id=https://example.com/')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should extract target from a section counter link', () => {
    const value = new URL(
      'http://index.hu/x?index_gazdasag_cikklink=http%3A%2F%2Fwww.example.com%2Fgazdasag%2Fadozas%2F438374',
    )
    const expected = 'http://www.example.com/gazdasag/adozas/438374'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should take the link fragment on a section counter link', () => {
    const value = new URL(
      'http://index.hu/x?index_tech_cikklink=https%3A%2F%2Fexample.com%2Fpost#top',
    )
    const expected = 'https://example.com/post#top'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should extract a twice-encoded target from a section counter link', () => {
    const value = new URL(
      'http://index.hu/x?index_tech_cikklink=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'http://index.hu/x?index_tech_cikklink=https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should return undefined when the section counter param is empty', () => {
    const value = new URL('http://index.hu/x?index_tech_cikklink=')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for a counter param not named after a section', () => {
    const value = new URL(
      'http://index.hu/x?cbl=2&c0_412=http://example.com/kultur/eletmod/rom0511/',
    )

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for a param that only starts with the section counter name', () => {
    const value = new URL('http://index.hu/x?index_tech_cikklinks=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for a param that only ends with the section counter name', () => {
    const value = new URL('http://index.hu/x?xindex_tech_cikklink=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for the section counter on another path', () => {
    const value = new URL('http://index.hu/y?index_tech_cikklink=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should extract target from a section counter link on dex.hu', () => {
    const value = new URL('http://dex.hu/x?index_tech_cikklink=http%3A%2F%2Fexample.com%2Fpost')
    const expected = 'http://example.com/post'

    expect(unwrapIndexHu(value)).toBe(expected)
  })

  it('should return undefined for the section counter on another host', () => {
    const value = new URL('https://example.com/x?index_tech_cikklink=https%3A%2F%2Fexample.org%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://index.hu/search.php?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/x.php?id=inxinx2&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapIndexHu(value)).toBeUndefined()
  })
})
