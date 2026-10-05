import { describe, expect, it } from 'bun:test'
import { unwrapBananatag } from './bananatag.js'

describe('unwrapBananatag', () => {
  it('should extract target from url param', () => {
    const url = new URL('http://s.bl-1.com/h/ttPQr7D?url=http://example.com/')

    expect(unwrapBananatag(url)).toBe('http://example.com/')
  })

  it('should extract target from url param on an i link', () => {
    const url = new URL(
      'https://s2.bl-1.com/h/i/dvr08c9n/7QtzGN7?url=https://www.example.com/now/video/199121989712',
    )

    expect(unwrapBananatag(url)).toBe('https://www.example.com/now/video/199121989712')
  })

  it('should extract a percent-encoded target', () => {
    const url = new URL(
      'https://s2.bl-1.com/h/dvZxHc9W?url=http%3A%2F%2Fwww.example.edu%2Fpresident',
    )

    expect(unwrapBananatag(url)).toBe('http://www.example.edu/president')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://s.bl-1.com/h/FdRKFcd')

    expect(unwrapBananatag(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('http://s.bl-1.com/h/FdRKFcd?url=')

    expect(unwrapBananatag(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('http://s.bl-1.com/o/FdRKFcd?url=http://example.com/')

    expect(unwrapBananatag(url)).toBeUndefined()
  })

  it('should return undefined for a path below a link', () => {
    const url = new URL('http://s.bl-1.com/h/FdRKFcd/extra?url=http://example.com/')

    expect(unwrapBananatag(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://example.com/h/FdRKFcd?url=http://example.org/')

    expect(unwrapBananatag(url)).toBeUndefined()
  })
})
