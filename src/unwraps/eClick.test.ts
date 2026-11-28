import { describe, expect, it } from 'bun:test'
import { unwrapEClick } from './eClick.js'

describe('unwrapEClick', () => {
  it('should extract a half-encoded target from url param', () => {
    const value = new URL(
      'http://www.e-click.jp/redirects/direct/14036/1550/?url=http%3A//www.example.com/haircare/index.html',
    )
    const expected = 'http://www.example.com/haircare/index.html'

    expect(unwrapEClick(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from url param', () => {
    const value = new URL(
      'https://www.e-click.jp/redirects/direct/30587/3426/?url=https%3A%2F%2Fwww.example.com%2Fitem%3Fid%3D2',
    )
    const expected = 'https://www.example.com/item?id=2'

    expect(unwrapEClick(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://www.e-click.jp/redirects/direct/14036/1550/')

    expect(unwrapEClick(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the e-click host', () => {
    const value = new URL(
      'http://www.e-click.jp/redirects/banner/14036/1550/?url=http%3A//www.example.com/',
    )

    expect(unwrapEClick(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'http://example.com/redirects/direct/14036/1550/?url=http%3A//www.example.org/',
    )

    expect(unwrapEClick(value)).toBeUndefined()
  })
})
