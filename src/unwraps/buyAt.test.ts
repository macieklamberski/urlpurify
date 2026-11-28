import { describe, expect, it } from 'bun:test'
import { unwrapBuyAt } from './buyAt.js'

describe('unwrapBuyAt', () => {
  it('should extract target from DURL param', () => {
    const value = new URL(
      'http://ticketsus.at/satchmeaux?CTY=37&DURL=http://www.example.com/Shinedown-tickets/artist/880497',
    )
    const expected = 'http://www.example.com/Shinedown-tickets/artist/880497'

    expect(unwrapBuyAt(value)).toBe(expected)
  })

  it('should return undefined when DURL param is missing', () => {
    const value = new URL('http://ticketsus.at/loucom?CTY=37')

    expect(unwrapBuyAt(value)).toBeUndefined()
  })

  it('should return undefined for a nested path on the vanity domain', () => {
    const value = new URL('http://ticketsus.at/loucom/promo?CTY=37&DURL=http://www.example.com/')

    expect(unwrapBuyAt(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/loucom?CTY=37&DURL=http://www.example.org/')

    expect(unwrapBuyAt(value)).toBeUndefined()
  })
})
