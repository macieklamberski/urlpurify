import { describe, expect, it } from 'bun:test'
import { unwrapStorify } from './storify.js'

describe('unwrapStorify', () => {
  it('should extract the target from the click counter', () => {
    const value = new URL(
      'http://stats.storify.com/record/click?sid=4f8f850411961bb2761318a7&redirect=http://example.com/dereksivers',
    )
    const expected = 'http://example.com/dereksivers'

    expect(unwrapStorify(value)).toBe(expected)
  })

  it('should return undefined when the redirect param is missing', () => {
    const value = new URL('http://stats.storify.com/record/click?sid=4f8f850411961bb2761318a7')

    expect(unwrapStorify(value)).toBeUndefined()
  })

  it('should return undefined for the view pixel on the host', () => {
    const value = new URL(
      'http://stats.storify.com/record/view.gif?sid=4f8f850411961bb2761318a7&redirect=http://example.com/',
    )

    expect(unwrapStorify(value)).toBeUndefined()
  })
})
