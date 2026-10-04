import { describe, expect, it } from 'bun:test'
import { unwrapIdealoPartner } from './idealoPartner.js'

describe('unwrapIdealoPartner', () => {
  it('should extract target from trg param', () => {
    const url = new URL('https://www.idealo-partner.com/?trg=https%3A%2F%2Fexample.com%2Foffer')

    expect(unwrapIdealoPartner(url)).toBe('https://example.com/offer')
  })

  it('should return undefined when trg param is missing', () => {
    const url = new URL('https://www.idealo-partner.com/?other=value')

    expect(unwrapIdealoPartner(url)).toBeUndefined()
  })

  it('should return undefined for non-idealo-partner hosts', () => {
    const url = new URL('https://example.com/?trg=https%3A%2F%2Fother.com')

    expect(unwrapIdealoPartner(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL('https://partner.idealo-partner.com/?trg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapIdealoPartner(url)).toBe('https://example.com/page')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://www.idealo-partner.com/other?trg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapIdealoPartner(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampleidealo-partner.com/?trg=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapIdealoPartner(url)).toBeUndefined()
  })
})
