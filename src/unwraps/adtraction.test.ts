import { describe, expect, it } from 'bun:test'
import { unwrapAdtraction } from './adtraction.js'

describe('unwrapAdtraction', () => {
  it('should extract a plain target from url param', () => {
    const value = new URL(
      'https://track.adtraction.com/t/t?a=1431792451&as=1259929598&t=2&tk=1&url=https://www.example.com/boker/becoming-supernatural',
    )
    const expected = 'https://www.example.com/boker/becoming-supernatural'

    expect(unwrapAdtraction(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from url param', () => {
    const value = new URL(
      'https://track.adtraction.com/t/t?a=1039659817&as=1110872131&t=2&tk=1&url=https%3A%2F%2Fwww.example.com%2Fproduct%2F%3Fid%3D1',
    )
    const expected = 'https://www.example.com/product/?id=1'

    expect(unwrapAdtraction(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://track.adtraction.com/t/t?a=1&as=2&t=2&tk=1')

    expect(unwrapAdtraction(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const value = new URL(
      'https://track.adtraction.com/t/i?a=1&as=2&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdtraction(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/t/t?a=1&as=2&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAdtraction(value)).toBeUndefined()
  })
})
