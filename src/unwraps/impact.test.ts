import { describe, expect, it } from 'bun:test'
import { unwrapImpact } from './impact.js'

describe('unwrapImpact', () => {
  it('should extract target from u param on a vanity host', () => {
    const url = new URL(
      'https://goto.example.com/c/34574/565706/9383?veh=aff&sourceid=imp_000011112222333344&u=https%3A%2F%2Fwww.example.com%2Fip%2Fsuperman-4k%2F17263205065%3FclassType%3DREGULAR%26from%3D%2Fsearch',
    )

    expect(unwrapImpact(url)).toBe(
      'https://www.example.com/ip/superman-4k/17263205065?classType=REGULAR&from=/search',
    )
  })

  it('should extract an http target', () => {
    const url = new URL(
      'http://shop.example.net/c/5142595/264167/4272?u=http%3A%2F%2Fwww.example.com%2Fnhl',
    )

    expect(unwrapImpact(url)).toBe('http://www.example.com/nhl')
  })

  it('should extract target when u comes first', () => {
    const url = new URL(
      'https://track.example.com/c/221109/473657/7613?u=https%3A%2F%2Fexample.com%2F&subId1=abc',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/')
  })

  it('should extract target on a host no specimen shows', () => {
    const url = new URL('https://affiliates.example.org/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fitem')

    expect(unwrapImpact(url)).toBe('https://example.com/item')
  })

  it('should extract target on a bare domain', () => {
    const url = new URL('https://example.com/c/264145/570222/9453?u=https%3A%2F%2Fexample.org%2Fp')

    expect(unwrapImpact(url)).toBe('https://example.org/p')
  })

  it('should extract target on an Impact subdomain', () => {
    const url = new URL(
      'https://merchant.sjv.io/c/221109/473657/7613?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/')
  })

  it('should extract target from a short code on sjv.io', () => {
    const url = new URL('https://square.sjv.io/Y6oeO?u=https%3A%2F%2Fexample.com%2Fus%2Fen')

    expect(unwrapImpact(url)).toBe('https://example.com/us/en')
  })

  it('should extract target from a short code on pxf.io', () => {
    const url = new URL('https://merchant.pxf.io/dOax33?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapImpact(url)).toBe('https://example.com/post')
  })

  it('should extract target from the root on pxf.io', () => {
    const url = new URL('https://merchant.pxf.io/?subId1=abc&u=https%3A%2F%2Fexample.com%2Fproduct')

    expect(unwrapImpact(url)).toBe('https://example.com/product')
  })

  it('should extract target from a longer click path on pxf.io', () => {
    const url = new URL(
      'https://merchant.pxf.io/c/381569/1https://merchant.pxf.io/c/381569/1448521/17195?u=https%3A%2F%2Fexample.com%2Fproduct',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/product')
  })

  it('should return undefined for a short code on another host', () => {
    const url = new URL('https://example.com/Y6oeO?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for the root on another host', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a longer click path on another host', () => {
    const url = new URL('https://example.com/c/381569/1448521?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike of sjv.io', () => {
    const url = new URL('https://examplesjv.io/Y6oeO?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike of pxf.io', () => {
    const url = new URL('https://examplepxf.io/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a host that starts with pxf.io', () => {
    const url = new URL('https://merchant.pxf.io.example.com/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a host that starts with sjv.io', () => {
    const url = new URL('https://merchant.sjv.io.example.com/Y6oeO?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a 7 character code on sjv.io', () => {
    const url = new URL('https://merchant.sjv.io/aB3dE9f?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a 4 character code on sjv.io', () => {
    const url = new URL('https://merchant.sjv.io/aB3d?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a short code under another segment on sjv.io', () => {
    const url = new URL('https://merchant.sjv.io/c/Y6oeO?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a click path without a second numeric id on pxf.io', () => {
    const url = new URL('https://merchant.pxf.io/c/123/about?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should keep the target query when it is not the first param', () => {
    const url = new URL(
      'https://goto.example.com/c/1/2/3?subId1=BV&u=https%3A%2F%2Fexample.com%2Fp%3Fsrsltid%3Dabc',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/p?srsltid=abc')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      'https://goto.example.com/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fr%3Fu%3Dhttps%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/r?u=https%3A%2F%2Fexample.org%2F')
  })

  it('should ignore a query the feed provider appended', () => {
    const url = new URL(
      'https://goto.example.com/c/1/2/3?u=https%3A%2F%2Fexample.com%2F&utm_source=rss',
    )

    expect(unwrapImpact(url)).toBe('https://example.com/')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?subId1=abc')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?u=')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for the same target in another param', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?u=ftp%3A%2F%2Fexample.com%2Ffile')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a javascript target', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?u=javascript%3Aalert(1)')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const url = new URL('https://example.com/c/1/2/3?u=%2Fproducts%2F42')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should extract a target that is encoded twice', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?u=https%253A%252F%252Fexample.com%252F')

    expect(unwrapImpact(url)).toBe('https://example.com/')
  })

  it('should return undefined for a target that is encoded twice and malformed', () => {
    const url = new URL('https://goto.example.com/c/1/2/3?u=https%253A%252F%252Fexample.com%25')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when a digit group is missing', () => {
    const url = new URL('https://goto.example.com/c/34574/565706?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when there is a fourth digit group', () => {
    const url = new URL(
      'https://goto.example.com/c/34574/565706/9383/1?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the first group is not digits', () => {
    const url = new URL(
      'https://goto.example.com/c/news/565706/9383?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the second group is not digits', () => {
    const url = new URL('https://goto.example.com/c/34574/news/9383?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the third group is not digits', () => {
    const url = new URL(
      'https://goto.example.com/c/34574/565706/news?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when a digit group is empty', () => {
    const url = new URL('https://goto.example.com/c//565706/9383?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the second group is empty', () => {
    const url = new URL('https://goto.example.com/c/34574//9383?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the third group is empty', () => {
    const url = new URL('https://goto.example.com/c/34574/565706/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for another one-letter path with three digit groups', () => {
    const url = new URL('https://example.com/p/34574/565706/9383?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before it', () => {
    const url = new URL(
      'https://example.com/blog/c/34574/565706/9383?u=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after it', () => {
    const url = new URL(
      'https://example.com/c/34574/565706/9383/share?u=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined when the path ends in a slash', () => {
    const url = new URL('https://example.com/c/34574/565706/9383/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })

  it('should return undefined for another path on an Impact host', () => {
    const url = new URL('https://merchant.sjv.io/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(url)).toBeUndefined()
  })
})
