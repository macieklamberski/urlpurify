import { describe, expect, it } from 'bun:test'
import { unwrapEbayRover } from './ebayRover.js'

describe('unwrapEbayRover', () => {
  it('should extract target from mpre param on rover.ebay.com', () => {
    const url = new URL(
      'https://rover.ebay.com/rover/1/711-53200-19255-0/1?campid=12345&mpre=https%3A%2F%2Fwww.ebay.com%2Fitm%2F123',
    )

    expect(unwrapEbayRover(url)).toBe('https://www.ebay.com/itm/123')
  })

  it('should match country-code TLDs (rover.ebay.co.uk)', () => {
    const url = new URL(
      'https://rover.ebay.co.uk/rover/1/710-53481-19255-0/1?mpre=https%3A%2F%2Fwww.ebay.co.uk%2Fitm%2F456',
    )

    expect(unwrapEbayRover(url)).toBe('https://www.ebay.co.uk/itm/456')
  })

  it('should return undefined when mpre param is missing', () => {
    const url = new URL('https://rover.ebay.com/rover/1/711-53200-19255-0/1?campid=12345')

    expect(unwrapEbayRover(url)).toBeUndefined()
  })

  it('should return undefined for non-rover hosts', () => {
    const url = new URL('https://example.com/?mpre=https%3A%2F%2Fother.com')

    expect(unwrapEbayRover(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL(
      'https://m.rover.ebay.de/rover/1/707-53477-19255-0/1?mpre=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEbayRover(url)).toBe('https://example.com/page')
  })

  it('should return undefined for another path on rover', () => {
    const url = new URL('https://rover.ebay.com/other?mpre=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapEbayRover(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://examplerover.ebay.com/rover/1/711-53200-19255-0/1?mpre=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEbayRover(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains the rover host', () => {
    const url = new URL(
      'https://rover.ebay.com.example.org/rover/1/711-53200-19255-0/1?mpre=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEbayRover(url)).toBeUndefined()
  })
})
