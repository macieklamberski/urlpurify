import { describe, expect, it } from 'bun:test'
import { unwrapA8Net } from './a8Net.js'

describe('unwrapA8Net', () => {
  it('should extract target from a8ejpredirect param on px.a8.net', () => {
    const url = new URL(
      'https://px.a8.net/svt/ejp?a8mat=3ZBKMX+A8JC8I+4NTO+BW0YB&a8ejpredirect=https%3A%2F%2Fexample.com%2Fjp%2Foffer%2F',
    )

    expect(unwrapA8Net(url)).toBe('https://example.com/jp/offer/')
  })

  it('should return undefined when a8ejpredirect param is missing', () => {
    const url = new URL('https://px.a8.net/svt/ejp?a8mat=3ZBKMX+A8JC8I+4NTO+BW0YB')

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined when a8ejpredirect param is empty', () => {
    const url = new URL('https://px.a8.net/svt/ejp?a8mat=3ZBKMX+A8JC8I+4NTO+BW0YB&a8ejpredirect=')

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should extract target from url param on the ow.a8.net deep link', () => {
    const url = new URL(
      'https://ow.a8.net/s00000014283002/redirect_v2.php?type=deeplink&url=https%3A%2F%2Fexample.com%2Fhotel%2Fjp%2Fstay.ja.html',
    )

    expect(unwrapA8Net(url)).toBe('https://example.com/hotel/jp/stay.ja.html')
  })

  it('should return undefined for other paths on the ow.a8.net host', () => {
    const url = new URL(
      'https://ow.a8.net/s00000014283002/other.php?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for a deep link path with a trailing segment', () => {
    const url = new URL(
      'https://ow.a8.net/s00000014283002/redirect_v2.php/extra?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for a deep link path with a leading segment', () => {
    const url = new URL(
      'https://ow.a8.net/x/s00000014283002/redirect_v2.php?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for a deep link path with a non-numeric program id', () => {
    const url = new URL('https://ow.a8.net/sx/redirect_v2.php?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for the URL param on the same path', () => {
    const url = new URL(
      'http://px.a8.net/svt/ejp?a8mat=OB1XY+9FD6OI+1N6+67JUB&URL=http://example.jp/afa8/goods.jsp?GOODS_NO=4012312',
    )

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the A8.net host', () => {
    const url = new URL('https://px.a8.net/svt/other?a8ejpredirect=https%3A%2F%2Fexample.com%2F')

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for non-A8.net hosts', () => {
    const url = new URL('https://example.com/svt/ejp?a8ejpredirect=https%3A%2F%2Fexample.org%2F')

    expect(unwrapA8Net(url)).toBeUndefined()
  })

  it('should return undefined for the deep link path on another A8.net host', () => {
    const url = new URL(
      'https://px.a8.net/s00000014283002/redirect_v2.php?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapA8Net(url)).toBeUndefined()
  })
})
