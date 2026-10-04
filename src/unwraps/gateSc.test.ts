import { describe, expect, it } from 'bun:test'
import { unwrapGateSc } from './gateSc.js'

describe('unwrapGateSc', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://gate.sc/?url=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapGateSc(url)).toBe('https://example.com/article')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://gate.sc/?other=value')

    expect(unwrapGateSc(url)).toBeUndefined()
  })

  it('should return undefined for non-gate.sc hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapGateSc(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://www.gate.sc/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGateSc(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://gate.sc/other?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGateSc(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplegate.sc/?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGateSc(url)).toBeUndefined()
  })
})
