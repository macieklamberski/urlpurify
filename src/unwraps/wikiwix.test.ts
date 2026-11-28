import { describe, expect, it } from 'bun:test'
import { unwrapWikiwix } from './wikiwix.js'

describe('unwrapWikiwix', () => {
  it('should extract target from url on the archive cache path', () => {
    const value = new URL(
      'http://archive.wikiwix.com/cache/?url=http%3A%2F%2Fwww.example.com%2Fnazi-grandma-convicted-denying-holocaust-fifth-time-1643424',
    )
    const expected =
      'http://www.example.com/nazi-grandma-convicted-denying-holocaust-fifth-time-1643424'

    expect(unwrapWikiwix(value)).toBe(expected)
  })

  it('should extract target from url on the archive index2.php path', () => {
    const value = new URL(
      'http://archive.wikiwix.com/cache/index2.php?url=https%3A%2F%2Fwww.example.com%2Fculture%2Fjoursanse-13-03-2018-2202156_3.php',
    )
    const expected = 'https://www.example.com/culture/joursanse-13-03-2018-2202156_3.php'

    expect(unwrapWikiwix(value)).toBe(expected)
  })

  it('should extract a plain target from url on the wikiwix.com cache path', () => {
    const value = new URL(
      'http://wikiwix.com/cache/?url=http://www.example.org/lieux_de_memoire.php?rub=162%26tag=2701',
    )
    const expected = 'http://www.example.org/lieux_de_memoire.php?rub=162&tag=2701'

    expect(unwrapWikiwix(value)).toBe(expected)
  })

  it('should return undefined for index2.php on wikiwix.com', () => {
    const value = new URL('https://wikiwix.com/cache/index2.php?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapWikiwix(value)).toBeUndefined()
  })

  it('should return undefined for the display2.php viewer', () => {
    const value = new URL(
      'https://archive.wikiwix.com/cache/display2.php?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapWikiwix(value)).toBeUndefined()
  })

  it('should return undefined when url is missing', () => {
    const value = new URL('http://archive.wikiwix.com/cache/')

    expect(unwrapWikiwix(value)).toBeUndefined()
  })

  it('should return undefined for the shape on a non-Wikiwix host', () => {
    const value = new URL('https://example.com/cache/?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapWikiwix(value)).toBeUndefined()
  })

  it('should drop the archive fragment', () => {
    const value = new URL(
      'https://archive.wikiwix.com/cache/?url=https://example.com/page#federation=archive.wikiwix.com',
    )
    const expected = 'https://example.com/page'

    expect(unwrapWikiwix(value)).toBe(expected)
  })
})
