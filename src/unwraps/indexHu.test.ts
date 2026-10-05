import { describe, expect, it } from 'bun:test'
import { unwrapIndexHu } from './indexHu.js'

describe('unwrapIndexHu', () => {
  it('should extract target from a dex.hu link', () => {
    const url = new URL(
      'https://dex.hu/x.php?id=index_gazdasag_cikklink&url=https%3A%2F%2Fwww.example.com%2Fkozelet%2F2015%2F03%2Fhir-szovege%2F',
    )

    expect(unwrapIndexHu(url)).toBe('https://www.example.com/kozelet/2015/03/hir-szovege/')
  })

  it('should extract target from an index.hu link', () => {
    const url = new URL(
      'http://index.hu/x.php?id=inxinx2&url=http%3A%2F%2Fexample.org%2Findex2%2F%23bloghu%2Fexample%2F2014%2F08%2F10%2Fcikk',
    )

    expect(unwrapIndexHu(url)).toBe('http://example.org/index2/#bloghu/example/2014/08/10/cikk')
  })

  it('should extract target from vakbarat.index.hu', () => {
    const url = new URL('http://vakbarat.index.hu/x.php?id=inxtc&url=https://www.example.com/')

    expect(unwrapIndexHu(url)).toBe('https://www.example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://dex.hu/x.php?id=index_tech_cikklink&url=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2',
    )

    expect(unwrapIndexHu(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should extract target when the url param comes first', () => {
    const url = new URL(
      'https://dex.hu/x.php?url=https%3A%2F%2Fexample.com%2F&id=index_tech_cikklink',
    )

    expect(unwrapIndexHu(url)).toBe('https://example.com/')
  })

  it('should return undefined for another subdomain of dex.hu', () => {
    const url = new URL(
      'https://m.dex.hu/x.php?id=index_tech_cikklink&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for another subdomain of index.hu', () => {
    const url = new URL(
      'https://tech.index.hu/x.php?id=index_tech_cikklink&url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined when the url param is missing', () => {
    const url = new URL('https://dex.hu/x.php?id=index_gazdasag_cikklink')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const url = new URL('https://dex.hu/x.php?id=index_gazdasag_cikklink&url=')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined when the target is in the id param', () => {
    const url = new URL('https://dex.hu/x.php?id=https://example.com/')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for the counter on another path', () => {
    const url = new URL('https://dex.hu/x?index_tech_cikklink=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://index.hu/search.php?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/x.php?id=inxinx2&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://notindex.hu/x.php?id=inxinx2&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapIndexHu(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain in its name', () => {
    const url = new URL(
      'https://dex.hu.example.net/x.php?id=inxinx2&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapIndexHu(url)).toBeUndefined()
  })
})
