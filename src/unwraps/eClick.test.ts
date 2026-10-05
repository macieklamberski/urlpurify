import { describe, expect, it } from 'bun:test'
import { unwrapEClick } from './eClick.js'

describe('unwrapEClick', () => {
  it('should extract a half-encoded target from url param', () => {
    const url = new URL(
      'http://www.e-click.jp/redirects/direct/14036/1550/?url=http%3A//www.example.com/haircare/index.html',
    )

    expect(unwrapEClick(url)).toBe('http://www.example.com/haircare/index.html')
  })

  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'https://www.e-click.jp/redirects/direct/30587/3426/?url=https%3A%2F%2Fwww.example.com%2Fitem%3Fid%3D2',
    )

    expect(unwrapEClick(url)).toBe('https://www.example.com/item?id=2')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://www.e-click.jp/redirects/direct/14036/1550/')

    expect(unwrapEClick(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the e-click host', () => {
    const url = new URL(
      'http://www.e-click.jp/redirects/banner/14036/1550/?url=http%3A//www.example.com/',
    )

    expect(unwrapEClick(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/redirects/direct/14036/1550/?url=http%3A//www.example.org/',
    )

    expect(unwrapEClick(url)).toBeUndefined()
  })
})
