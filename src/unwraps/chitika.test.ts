import { describe, expect, it } from 'bun:test'
import { unwrapChitika } from './chitika.js'

describe('unwrapChitika', () => {
  it('should extract the target from the click', () => {
    const value = new URL(
      'http://linx.chitika.net/track?target=http%3A//www.example.com/d/sr/%3Fxargs%3DbYqq9t439VqO',
    )
    const expected = 'http://www.example.com/d/sr/?xargs=bYqq9t439VqO'

    expect(unwrapChitika(value)).toBe(expected)
  })

  it('should return undefined when the target param is missing', () => {
    const value = new URL('http://linx.chitika.net/track?id=1')

    expect(unwrapChitika(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('http://linx.chitika.net/view?target=http%3A//www.example.com/')

    expect(unwrapChitika(value)).toBeUndefined()
  })
})
