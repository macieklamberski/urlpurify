import { describe, expect, it } from 'bun:test'
import { unwrapPinterest } from './pinterest.js'

describe('unwrapPinterest', () => {
  it('should extract the target from the offsite shim', () => {
    const value = new URL(
      'http://pinterest.com/offsite/?url=http%3A%2F%2Fwww.example.com%2Fhome%2F2016%2F7%2F29%2Ffavorite-books&shatoken=4ba2b2c4a24b3a9b',
    )
    const expected = 'http://www.example.com/home/2016/7/29/favorite-books'

    expect(unwrapPinterest(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.pinterest.com/offsite/?token=123-123')

    expect(unwrapPinterest(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.pinterest.com/pin/950541065071675964/?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapPinterest(value)).toBeUndefined()
  })
})
