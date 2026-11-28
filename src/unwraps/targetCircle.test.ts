import { describe, expect, it } from 'bun:test'
import { unwrapTargetCircle } from './targetCircle.js'

describe('unwrapTargetCircle', () => {
  it('should extract target from r param on the root path', () => {
    const value = new URL(
      'https://c.trackmytarget.com/?a=kss8fp&i=b2y0d4&r=https%3A%2F%2Fwww.example.com%2Fde%2Fde%2Fhome',
    )
    const expected = 'https://www.example.com/de/de/home'

    expect(unwrapTargetCircle(value)).toBe(expected)
  })

  it('should extract target from r param on a link id path', () => {
    const value = new URL(
      'https://c.trackmytarget.com/005vyp?r=https%3A%2F%2Fwww.example.com%2Fcamu-camu-berry-powder',
    )
    const expected = 'https://www.example.com/camu-camu-berry-powder'

    expect(unwrapTargetCircle(value)).toBe(expected)
  })

  it('should return undefined when r param is missing', () => {
    const value = new URL('https://c.trackmytarget.com/?a=kss8fp&i=b2y0d4')

    expect(unwrapTargetCircle(value)).toBeUndefined()
  })

  it('should return undefined for a path longer than a link id', () => {
    const value = new URL('https://c.trackmytarget.com/redirect?r=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTargetCircle(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/?a=kss8fp&i=b2y0d4&r=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapTargetCircle(value)).toBeUndefined()
  })
})
