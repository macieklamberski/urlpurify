import { describe, expect, it } from 'bun:test'
import { unwrapJustwatch } from './justwatch.js'

describe('unwrapJustwatch', () => {
  it('should extract target from r param', () => {
    const value = new URL(
      'https://click.justwatch.com/a?uct_web_app_version=3.8.2-webapp%23eb6ba36&r=http%3A%2F%2Fwww.example.com%2Ftitle%2F80232398&cx=eyJzY2hlbWEiOiJpZ2x1In0&uct_country=us',
    )
    const expected = 'http://www.example.com/title/80232398'

    expect(unwrapJustwatch(value)).toBe(expected)
  })

  it('should extract target from r param on the e host', () => {
    const value = new URL(
      'https://e.justwatch.com/a?uct_web_app_version=3.9.2-webapp%237227038&r=https%3A%2F%2Fwww.example.com%2Fau%2Fepisode%2Fjimmying%3Fat%3D1000l3V2&cx=eyJzY2hlbWEiOiJpZ2x1In0',
    )
    const expected = 'https://www.example.com/au/episode/jimmying?at=1000l3V2'

    expect(unwrapJustwatch(value)).toBe(expected)
  })

  it('should return undefined when r param is missing', () => {
    const value = new URL('https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1In0&uct_country=us')

    expect(unwrapJustwatch(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the JustWatch host', () => {
    const value = new URL('https://click.justwatch.com/i?r=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapJustwatch(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/a?r=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapJustwatch(value)).toBeUndefined()
  })
})
