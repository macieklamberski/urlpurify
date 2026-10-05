import { describe, expect, it } from 'bun:test'
import { unwrapTargetCircle } from './targetCircle.js'

describe('unwrapTargetCircle', () => {
  it('should extract target from r param on the root path', () => {
    const url = new URL(
      'https://c.trackmytarget.com/?a=kss8fp&i=b2y0d4&r=https%3A%2F%2Fwww.example.com%2Fde%2Fde%2Fhome',
    )

    expect(unwrapTargetCircle(url)).toBe('https://www.example.com/de/de/home')
  })

  it('should extract target from r param on a link id path', () => {
    const url = new URL(
      'https://c.trackmytarget.com/005vyp?r=https%3A%2F%2Fwww.example.com%2Fcamu-camu-berry-powder',
    )

    expect(unwrapTargetCircle(url)).toBe('https://www.example.com/camu-camu-berry-powder')
  })

  it('should return undefined when r param is missing', () => {
    const url = new URL('https://c.trackmytarget.com/?a=kss8fp&i=b2y0d4')

    expect(unwrapTargetCircle(url)).toBeUndefined()
  })

  it('should return undefined for a path longer than a link id', () => {
    const url = new URL('https://c.trackmytarget.com/redirect?r=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTargetCircle(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?a=kss8fp&i=b2y0d4&r=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTargetCircle(url)).toBeUndefined()
  })
})
