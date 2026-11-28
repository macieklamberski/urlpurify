import { describe, expect, it } from 'bun:test'
import { unwrapAdcell } from './adcell.js'

describe('unwrapAdcell', () => {
  it('should extract target from param0 param', () => {
    const value = new URL(
      'https://t.adcell.com/p/click?promoId=281043&slotId=108443&param0=https%3A%2F%2Fwww.example.com%2Findividual.html',
    )
    const expected = 'https://www.example.com/individual.html'

    expect(unwrapAdcell(value)).toBe(expected)
  })

  it('should extract target from param0 param on click.php', () => {
    const value = new URL(
      'https://t.adcell.com/click.php?bid=177629-127265&param0=https%3A%2F%2Fwww.example.com%2Ffilterhalter%2F',
    )
    const expected = 'https://www.example.com/filterhalter/'

    expect(unwrapAdcell(value)).toBe(expected)
  })

  it('should extract target from param0 param on the promotion path', () => {
    const value = new URL(
      'https://www.adcell.de/promotion/click/promoId/99905/slotId/74898?param0=https%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapAdcell(value)).toBe(expected)
  })

  it('should extract target from param0 param on click.php on www.adcell.de', () => {
    const value = new URL(
      'https://www.adcell.de/click.php?bid=172221-81397&param0=https%3A%2F%2Fwww.example.com%2Fguertel-13059.html',
    )
    const expected = 'https://www.example.com/guertel-13059.html'

    expect(unwrapAdcell(value)).toBe(expected)
  })

  it('should return undefined when param0 param is missing', () => {
    const value = new URL('https://t.adcell.com/p/click?promoId=281043&slotId=108443')

    expect(unwrapAdcell(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://t.adcell.com/p/view?param0=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAdcell(value)).toBeUndefined()
  })

  it('should return undefined for a promotion path without a slot id', () => {
    const value = new URL(
      'https://www.adcell.de/promotion/click/promoId/99905?param0=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdcell(value)).toBeUndefined()
  })

  it('should return undefined for a click path under a prefix', () => {
    const value = new URL('https://t.adcell.com/x/p/click?param0=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAdcell(value)).toBeUndefined()
  })

  it('should return undefined for a path below the click path', () => {
    const value = new URL(
      'https://t.adcell.com/p/click/extra?param0=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdcell(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/p/click?param0=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAdcell(value)).toBeUndefined()
  })
})
