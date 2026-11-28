import { describe, expect, it } from 'bun:test'
import { unwrapMailpgn } from './mailpgn.js'

describe('unwrapMailpgn', () => {
  it('should extract target from fl param', () => {
    const value = new URL('https://t.mailpgn.com/l/?fl=https%3A%2F%2Fexample.com%2Fcampaign')
    const expected = 'https://example.com/campaign'

    expect(unwrapMailpgn(value)).toBe(expected)
  })

  it('should return undefined when fl param is missing', () => {
    const value = new URL('https://t.mailpgn.com/l/?other=value')

    expect(unwrapMailpgn(value)).toBeUndefined()
  })

  it('should return undefined for non-mailpgn hosts', () => {
    const value = new URL('https://example.com/l/?fl=https%3A%2F%2Fother.com')

    expect(unwrapMailpgn(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://t.mailpgn.com/m/?fl=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMailpgn(value)).toBeUndefined()
  })
})
