import { describe, expect, it } from 'bun:test'
import { unwrapMailpgn } from './mailpgn.js'

describe('unwrapMailpgn', () => {
  it('should extract target from fl param', () => {
    const url = new URL('https://t.mailpgn.com/l/?fl=https%3A%2F%2Fexample.com%2Fcampaign')

    expect(unwrapMailpgn(url)).toBe('https://example.com/campaign')
  })

  it('should return undefined when fl param is missing', () => {
    const url = new URL('https://t.mailpgn.com/l/?other=value')

    expect(unwrapMailpgn(url)).toBeUndefined()
  })

  it('should return undefined for non-mailpgn hosts', () => {
    const url = new URL('https://example.com/l/?fl=https%3A%2F%2Fother.com')

    expect(unwrapMailpgn(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://eu.mailpgn.com/l/?fl=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailpgn(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL('https://examplemailpgn.com/l/?fl=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailpgn(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://t.mailpgn.com/m/?fl=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailpgn(url)).toBeUndefined()
  })
})
