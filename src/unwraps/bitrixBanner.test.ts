import { describe, expect, it } from 'bun:test'
import { unwrapBitrixBanner } from './bitrixBanner.js'

describe('unwrapBitrixBanner', () => {
  it('should extract target from goto param', () => {
    const url = new URL(
      'http://www.example.ru/bitrix/rk.php?id=1&event1=banner&event2=click&event3=1+%2F+%5B1%5D+%5Bmain_bottom%5D&goto=http%3A%2F%2Fwww.example.ru%2Fairport-map%2F',
    )

    expect(unwrapBitrixBanner(url)).toBe('http://www.example.ru/airport-map/')
  })

  it('should return undefined when goto param is missing', () => {
    const url = new URL('http://www.example.ru/bitrix/rk.php?id=1&event1=banner&event2=click')

    expect(unwrapBitrixBanner(url)).toBeUndefined()
  })

  it('should return undefined for the outbound link counter path', () => {
    const url = new URL('https://www.example.ru/bitrix/redirect.php?goto=https://www.example.com/')

    expect(unwrapBitrixBanner(url)).toBeUndefined()
  })
})
