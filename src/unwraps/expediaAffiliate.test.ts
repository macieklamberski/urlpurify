import { describe, expect, it } from 'bun:test'
import { unwrapExpediaAffiliate } from './expediaAffiliate.js'

describe('unwrapExpediaAffiliate', () => {
  it('should extract target from landingPage param', () => {
    const url = new URL(
      'https://expedia.com/affiliate?siteid=1&landingPage=https%3A%2F%2Fwww.example.com%2FCanggu-Hotels.h16728717.Hotel-Information&camref=1011lqx7x&creativeref=1100l68075',
    )

    expect(unwrapExpediaAffiliate(url)).toBe(
      'https://www.example.com/Canggu-Hotels.h16728717.Hotel-Information',
    )
  })

  it('should return undefined for a short affiliate link', () => {
    const url = new URL('https://expedia.com/affiliate/eA2cKky')

    expect(unwrapExpediaAffiliate(url)).toBeUndefined()
  })

  it('should return undefined when landingPage param is missing', () => {
    const url = new URL('https://expedia.com/affiliate?siteid=1&camref=1011lqx7x')

    expect(unwrapExpediaAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Expedia host', () => {
    const url = new URL(
      'https://expedia.com/Hotel-Search?landingPage=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapExpediaAffiliate(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/affiliate?landingPage=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapExpediaAffiliate(url)).toBeUndefined()
  })
})
