import { describe, expect, it } from 'bun:test'
import { unwrapBananatag } from './bananatag.js'

describe('unwrapBananatag', () => {
  it('should extract target from url param', () => {
    const value = new URL('http://s.bl-1.com/h/ttPQr7D?url=http://example.com/')
    const expected = 'http://example.com/'

    expect(unwrapBananatag(value)).toBe(expected)
  })

  it('should extract target from url param on an i link', () => {
    const value = new URL(
      'https://s2.bl-1.com/h/i/dvr08c9n/7QtzGN7?url=https://www.example.com/now/video/199121989712',
    )
    const expected = 'https://www.example.com/now/video/199121989712'

    expect(unwrapBananatag(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'https://s2.bl-1.com/h/dvZxHc9W?url=http%3A%2F%2Fwww.example.edu%2Fpresident',
    )
    const expected = 'http://www.example.edu/president'

    expect(unwrapBananatag(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://s.bl-1.com/h/FdRKFcd')

    expect(unwrapBananatag(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('http://s.bl-1.com/h/FdRKFcd?url=')

    expect(unwrapBananatag(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('http://s.bl-1.com/o/FdRKFcd?url=http://example.com/')

    expect(unwrapBananatag(value)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const value = new URL('http://s.bl-1.com/h/FdRKFcd/extra?url=http://example.com/')

    expect(unwrapBananatag(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('http://example.com/h/FdRKFcd?url=http://example.org/')

    expect(unwrapBananatag(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL('http://s.bl-1.com/x/h/FdRKFcd?url=http://example.com/')

    expect(unwrapBananatag(value)).toBeUndefined()
  })
})
