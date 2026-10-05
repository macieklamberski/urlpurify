import { describe, expect, it } from 'bun:test'
import { unwrapCommissionFactory } from './commissionFactory.js'

describe('unwrapCommissionFactory', () => {
  it('should extract target from Url param', () => {
    const url = new URL(
      'https://t.cfjump.com/57373/t/1564?Url=https%3a%2f%2fwww.example.com%2fboon-trunk-lunch-box%2f',
    )

    expect(unwrapCommissionFactory(url)).toBe('https://www.example.com/boon-trunk-lunch-box/')
  })

  it('should extract target from Url param before other params', () => {
    const url = new URL(
      'https://t.cfjump.com/42132/t/87106?Url=https%3A%2F%2Fwww.example.com%2Fbrand%2Fburts-bees&UniqueId=bc',
    )

    expect(unwrapCommissionFactory(url)).toBe('https://www.example.com/brand/burts-bees')
  })

  it('should return undefined when Url param is missing', () => {
    const url = new URL('https://t.cfjump.com/81607/t/14846')

    expect(unwrapCommissionFactory(url)).toBeUndefined()
  })

  it('should return undefined for the banner path', () => {
    const url = new URL(
      'https://t.cfjump.com/72403/b/187765?Url=https%3a%2f%2fwww.example.com%2fwork-light.html',
    )

    expect(unwrapCommissionFactory(url)).toBeUndefined()
  })

  it('should return undefined for a click path with a suffix', () => {
    const url = new URL('https://t.cfjump.com/57373/t/1564/x?Url=https%3a%2f%2fwww.example.com%2f')

    expect(unwrapCommissionFactory(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/57373/t/1564?Url=https%3a%2f%2fwww.example.org%2f')

    expect(unwrapCommissionFactory(url)).toBeUndefined()
  })
})
