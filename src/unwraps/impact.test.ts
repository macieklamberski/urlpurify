import { describe, expect, it } from 'bun:test'
import { unwrapImpact } from './impact.js'

describe('unwrapImpact', () => {
  it('should extract target from u param on a vanity host', () => {
    const value = new URL(
      'https://goto.example.com/c/34574/565706/9383?veh=aff&sourceid=imp_000011112222333344&u=https%3A%2F%2Fwww.example.com%2Fip%2Fsuperman-4k%2F17263205065%3FclassType%3DREGULAR%26from%3D%2Fsearch',
    )
    const expected =
      'https://www.example.com/ip/superman-4k/17263205065?classType=REGULAR&from=/search'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract an http target', () => {
    const value = new URL(
      'http://shop.example.net/c/5142595/264167/4272?u=http%3A%2F%2Fwww.example.com%2Fnhl',
    )
    const expected = 'http://www.example.com/nhl'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target when u comes first', () => {
    const value = new URL(
      'https://track.example.com/c/221109/473657/7613?u=https%3A%2F%2Fexample.com%2F&subId1=abc',
    )
    const expected = 'https://example.com/'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target on a host no specimen shows', () => {
    const value = new URL(
      'https://affiliates.example.org/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fitem',
    )
    const expected = 'https://example.com/item'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target on a bare domain', () => {
    const value = new URL(
      'https://example.com/c/264145/570222/9453?u=https%3A%2F%2Fexample.org%2Fp',
    )
    const expected = 'https://example.org/p'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target on an Impact subdomain', () => {
    const value = new URL(
      'https://merchant.sjv.io/c/221109/473657/7613?u=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target from a short code on sjv.io', () => {
    const value = new URL('https://square.sjv.io/Y6oeO?u=https%3A%2F%2Fexample.com%2Fus%2Fen')
    const expected = 'https://example.com/us/en'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target from a short code on pxf.io', () => {
    const value = new URL('https://merchant.pxf.io/dOax33?u=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target from the root on pxf.io', () => {
    const value = new URL(
      'https://merchant.pxf.io/?subId1=abc&u=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract target from a longer click path on pxf.io', () => {
    const value = new URL(
      'https://merchant.pxf.io/c/381569/1https://merchant.pxf.io/c/381569/1448521/17195?u=https%3A%2F%2Fexample.com%2Fproduct',
    )
    const expected = 'https://example.com/product'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should return undefined for a short code on another host', () => {
    const value = new URL('https://example.com/Y6oeO?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for the root on another host', () => {
    const value = new URL('https://example.com/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a longer click path on another host', () => {
    const value = new URL('https://example.com/c/381569/1448521?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike of sjv.io', () => {
    const value = new URL('https://examplesjv.io/Y6oeO?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike of pxf.io', () => {
    const value = new URL('https://examplepxf.io/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a host that starts with pxf.io', () => {
    const value = new URL('https://merchant.pxf.io.example.com/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a host that starts with sjv.io', () => {
    const value = new URL(
      'https://merchant.sjv.io.example.com/Y6oeO?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a 7 character code on sjv.io', () => {
    const value = new URL('https://merchant.sjv.io/aB3dE9f?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a 4 character code on sjv.io', () => {
    const value = new URL('https://merchant.sjv.io/aB3d?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a short code under another segment on sjv.io', () => {
    const value = new URL('https://merchant.sjv.io/c/Y6oeO?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a click path without a second numeric id on pxf.io', () => {
    const value = new URL('https://merchant.pxf.io/c/123/about?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should keep the target query when it is not the first param', () => {
    const value = new URL(
      'https://goto.example.com/c/1/2/3?subId1=BV&u=https%3A%2F%2Fexample.com%2Fp%3Fsrsltid%3Dabc',
    )
    const expected = 'https://example.com/p?srsltid=abc'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://adorama.evyy.net/c/60434/51926/1036?u=https://www.example.com/l/?searchinfo=canon+rf+adapter',
    )
    const expected = 'https://www.example.com/l/?searchinfo=canon+rf+adapter'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should read the first copy of u', () => {
    const value = new URL(
      'https://goto.example.com/c/1/2/3?u=https://www.example.com/a+b&u=https://www.example.com/c',
    )
    const expected = 'https://www.example.com/a+b'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should extract a target that is another wrapper', () => {
    const value = new URL(
      'https://goto.example.com/c/1/2/3?u=https%3A%2F%2Fexample.com%2Fr%3Fu%3Dhttps%253A%252F%252Fexample.org%252F',
    )
    const expected = 'https://example.com/r?u=https%3A%2F%2Fexample.org%2F'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should ignore a query the feed provider appended', () => {
    const value = new URL(
      'https://goto.example.com/c/1/2/3?u=https%3A%2F%2Fexample.com%2F&utm_source=rss',
    )
    const expected = 'https://example.com/'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?subId1=abc')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?u=')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for the same target in another param', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?u=ftp%3A%2F%2Fexample.com%2Ffile')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a javascript target', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?u=javascript%3Aalert(1)')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for a relative target', () => {
    const value = new URL('https://example.com/c/1/2/3?u=%2Fproducts%2F42')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should extract a target that is encoded twice', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?u=https%253A%252F%252Fexample.com%252F')
    const expected = 'https://example.com/'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://goto.example.com/c/1/2/3?u=https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapImpact(value)).toBe(expected)
  })

  it('should return undefined for a target that is encoded twice and malformed', () => {
    const value = new URL('https://goto.example.com/c/1/2/3?u=https%253A%252F%252Fexample.com%25')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when a digit group is missing', () => {
    const value = new URL('https://goto.example.com/c/34574/565706?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when there is a fourth digit group', () => {
    const value = new URL(
      'https://goto.example.com/c/34574/565706/9383/1?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the first group is not digits', () => {
    const value = new URL(
      'https://goto.example.com/c/news/565706/9383?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the second group is not digits', () => {
    const value = new URL(
      'https://goto.example.com/c/34574/news/9383?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the third group is not digits', () => {
    const value = new URL(
      'https://goto.example.com/c/34574/565706/news?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when a digit group is empty', () => {
    const value = new URL('https://goto.example.com/c//565706/9383?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the second group is empty', () => {
    const value = new URL('https://goto.example.com/c/34574//9383?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the third group is empty', () => {
    const value = new URL('https://goto.example.com/c/34574/565706/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for another one-letter path with three digit groups', () => {
    const value = new URL('https://example.com/p/34574/565706/9383?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before it', () => {
    const value = new URL(
      'https://example.com/blog/c/34574/565706/9383?u=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after it', () => {
    const value = new URL(
      'https://example.com/c/34574/565706/9383/share?u=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined when the path ends in a slash', () => {
    const value = new URL('https://example.com/c/34574/565706/9383/?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })

  it('should return undefined for another path on an Impact host', () => {
    const value = new URL('https://merchant.sjv.io/?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapImpact(value)).toBeUndefined()
  })
})
