import { describe, expect, it } from 'bun:test'
import { unwrapTicketsus } from './ticketsus.js'

describe('unwrapTicketsus', () => {
  it('should extract target from DURL param', () => {
    const url = new URL(
      'http://ticketsus.at/satchmeaux?CTY=37&DURL=http://www.example.com/Shinedown-tickets/artist/880497',
    )

    expect(unwrapTicketsus(url)).toBe('http://www.example.com/Shinedown-tickets/artist/880497')
  })

  it('should return undefined when DURL param is missing', () => {
    const url = new URL('http://ticketsus.at/loucom?CTY=37')

    expect(unwrapTicketsus(url)).toBeUndefined()
  })

  it('should return undefined for a nested path on the ticketsus.at host', () => {
    const url = new URL('http://ticketsus.at/loucom/promo?CTY=37&DURL=http://www.example.com/')

    expect(unwrapTicketsus(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/loucom?CTY=37&DURL=http://www.example.org/')

    expect(unwrapTicketsus(url)).toBeUndefined()
  })
})
