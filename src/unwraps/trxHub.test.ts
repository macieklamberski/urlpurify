import { describe, expect, it } from 'bun:test'
import { unwrapTrxHub } from './trxHub.js'

describe('unwrapTrxHub', () => {
  it('should extract target from q param on an xid link', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/xid/leafgroup_ca5e0_wellgood?q=https%3A%2F%2Fwww.example.com%2Farticle%2F10.1007&p=https%3A%2F%2Fwww.example.org%2Ftreehouse-hotels%2F&event_type=click',
    )
    const expected = 'https://www.example.com/article/10.1007'

    expect(unwrapTrxHub(value)).toBe(expected)
  })

  it('should extract target from q param on a syid link', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/syid/57076d85ce107?q=https%3A%2F%2Fwww.example.com%2Fip%2F123&original_page=https%3A%2F%2Fwww.example.org%2F',
    )
    const expected = 'https://www.example.com/ip/123'

    expect(unwrapTrxHub(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/xid/forbes_ghj568dre?q=https%253A%252F%252Fwww.example.com%252Fr.cfm%253Fb%253D999&event_type=click',
    )
    const expected = 'https://www.example.com/r.cfm?b=999'

    expect(unwrapTrxHub(value)).toBe(expected)
  })

  it('should return undefined when q param is missing', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/xid/pmc_0aaa4_rollingstone?p=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTrxHub(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('https://clicks.trx-hub.com/pixel?q=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTrxHub(value)).toBeUndefined()
  })

  it('should return undefined for a path below an xid link', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/xid/pmc_0aaa4_rollingstone/extra?q=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTrxHub(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL(
      'https://example.com/xid/pmc_0aaa4_rollingstone?q=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapTrxHub(value)).toBeUndefined()
  })

  it('should return undefined for the shape below another path', () => {
    const value = new URL(
      'https://clicks.trx-hub.com/x/xid/pmc_0aaa4_rollingstone?q=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapTrxHub(value)).toBeUndefined()
  })
})
