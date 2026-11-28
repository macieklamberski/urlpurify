import { describe, expect, it } from 'bun:test'
import { unwrapGateSc } from './gateSc.js'

describe('unwrapGateSc', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://gate.sc/?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapGateSc(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://gate.sc/?other=value')

    expect(unwrapGateSc(value)).toBeUndefined()
  })

  it('should return undefined for non-gate.sc hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapGateSc(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://gate.sc/other?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGateSc(value)).toBeUndefined()
  })
})
