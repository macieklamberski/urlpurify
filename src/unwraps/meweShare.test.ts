import { describe, expect, it } from 'bun:test'
import { unwrapMeweShare } from './meweShare.js'

describe('unwrapMeweShare', () => {
  it('should extract the target from the share link', () => {
    const value = new URL(
      'https://mewe.com/share?link=https%3A%2F%2Fexample.com%2Fblogs%2Fisscr-2024-roundup%2F',
    )
    const expected = 'https://example.com/blogs/isscr-2024-roundup/'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should keep the query of an encoded target', () => {
    const value = new URL(
      'https://mewe.com/share?link=https%3A%2F%2Fexample.com%2F2018%2F03%2F22%2Fwho-is-rickys-daddy%2Ffeed%2F%3Fwithoutcomments%3D1',
    )
    const expected = 'https://example.com/2018/03/22/who-is-rickys-daddy/feed/?withoutcomments=1'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should keep an http target as http', () => {
    const value = new URL(
      'https://mewe.com/share?link=http%3A%2F%2Fwww.example.com%2F2020%2F11%2F20%2Flo-maravillosos-que-es-iniciar-de-cero%2F',
    )
    const expected = 'http://www.example.com/2020/11/20/lo-maravillosos-que-es-iniciar-de-cero/'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('https://mewe.com/share?link=https://example.com/post')
    const expected = 'https://example.com/post'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL('https://mewe.com/share?link=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://mewe.com/Share?link=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapMeweShare(value)).toBe(expected)
  })

  it('should return undefined when the link param is missing', () => {
    const value = new URL('https://mewe.com/share')

    expect(unwrapMeweShare(value)).toBeUndefined()
  })

  it('should return undefined when the link param is empty', () => {
    const value = new URL('https://mewe.com/share?link=')

    expect(unwrapMeweShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://mewe.com/i/example?link=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMeweShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/share?link=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapMeweShare(value)).toBeUndefined()
  })
})
