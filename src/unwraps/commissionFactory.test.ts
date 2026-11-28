import { describe, expect, it } from 'bun:test'
import { unwrapCommissionFactory } from './commissionFactory.js'

describe('unwrapCommissionFactory', () => {
  it('should extract target from Url param', () => {
    const value = new URL(
      'https://t.cfjump.com/57373/t/1564?Url=https%3a%2f%2fwww.example.com%2fboon-trunk-lunch-box%2f',
    )
    const expected = 'https://www.example.com/boon-trunk-lunch-box/'

    expect(unwrapCommissionFactory(value)).toBe(expected)
  })

  it('should extract target from Url param before other params', () => {
    const value = new URL(
      'https://t.cfjump.com/42132/t/87106?Url=https%3A%2F%2Fwww.example.com%2Fbrand%2Fburts-bees&UniqueId=bc',
    )
    const expected = 'https://www.example.com/brand/burts-bees'

    expect(unwrapCommissionFactory(value)).toBe(expected)
  })

  it('should return undefined when Url param is missing', () => {
    const value = new URL('https://t.cfjump.com/81607/t/14846')

    expect(unwrapCommissionFactory(value)).toBeUndefined()
  })

  it('should extract target from Url param on the banner click path', () => {
    const value = new URL(
      'https://t.cfjump.com/72403/b/187765?Url=https%3a%2f%2fwww.example.com%2fwork-light.html',
    )
    const expected = 'https://www.example.com/work-light.html'

    expect(unwrapCommissionFactory(value)).toBe(expected)
  })

  it('should return undefined for the banner impression path', () => {
    const value = new URL(
      'https://t.cfjump.com/72403/a/187765?Url=https%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapCommissionFactory(value)).toBeUndefined()
  })

  it('should return undefined for a click path with a suffix', () => {
    const value = new URL(
      'https://t.cfjump.com/57373/t/1564/x?Url=https%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapCommissionFactory(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/57373/t/1564?Url=https%3a%2f%2fwww.example.org%2f')

    expect(unwrapCommissionFactory(value)).toBeUndefined()
  })
})
