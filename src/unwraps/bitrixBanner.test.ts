import { describe, expect, it } from 'bun:test'
import { unwrapBitrixBanner } from './bitrixBanner.js'

describe('unwrapBitrixBanner', () => {
  it('should extract target from goto param', () => {
    const value = new URL(
      'http://www.example.ru/bitrix/rk.php?id=1&event1=banner&event2=click&event3=1+%2F+%5B1%5D+%5Bmain_bottom%5D&goto=http%3A%2F%2Fwww.example.ru%2Fairport-map%2F',
    )
    const expected = 'http://www.example.ru/airport-map/'

    expect(unwrapBitrixBanner(value)).toBe(expected)
  })

  it('should return undefined when goto param is missing', () => {
    const value = new URL('http://www.example.ru/bitrix/rk.php?id=1&event1=banner&event2=click')

    expect(unwrapBitrixBanner(value)).toBeUndefined()
  })

  it('should return undefined for the outbound link counter path', () => {
    const value = new URL(
      'https://www.example.ru/bitrix/redirect.php?goto=https://www.example.com/',
    )

    expect(unwrapBitrixBanner(value)).toBeUndefined()
  })
})
