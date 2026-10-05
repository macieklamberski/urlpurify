import { describe, expect, it } from 'bun:test'
import { unwrapAdcell } from './adcell.js'

describe('unwrapAdcell', () => {
  it('should extract target from param0 param', () => {
    const url = new URL(
      'https://t.adcell.com/p/click?promoId=281043&slotId=108443&param0=https%3A%2F%2Fwww.example.com%2Findividual.html',
    )

    expect(unwrapAdcell(url)).toBe('https://www.example.com/individual.html')
  })

  it('should extract target from param0 param on click.php', () => {
    const url = new URL(
      'https://t.adcell.com/click.php?bid=177629-127265&param0=https%3A%2F%2Fwww.example.com%2Ffilterhalter%2F',
    )

    expect(unwrapAdcell(url)).toBe('https://www.example.com/filterhalter/')
  })

  it('should extract target from param0 param on the promotion path', () => {
    const url = new URL(
      'https://www.adcell.de/promotion/click/promoId/99905/slotId/74898?param0=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdcell(url)).toBe('https://www.example.com/')
  })

  it('should extract target from param0 param on click.php on www.adcell.de', () => {
    const url = new URL(
      'https://www.adcell.de/click.php?bid=172221-81397&param0=https%3A%2F%2Fwww.example.com%2Fguertel-13059.html',
    )

    expect(unwrapAdcell(url)).toBe('https://www.example.com/guertel-13059.html')
  })

  it('should return undefined when param0 param is missing', () => {
    const url = new URL('https://t.adcell.com/p/click?promoId=281043&slotId=108443')

    expect(unwrapAdcell(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://t.adcell.com/p/view?param0=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAdcell(url)).toBeUndefined()
  })

  it('should return undefined for a promotion path without a slot id', () => {
    const url = new URL(
      'https://www.adcell.de/promotion/click/promoId/99905?param0=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdcell(url)).toBeUndefined()
  })

  it('should return undefined for a click path under a prefix', () => {
    const url = new URL('https://t.adcell.com/x/p/click?param0=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAdcell(url)).toBeUndefined()
  })

  it('should return undefined for a path below the click path', () => {
    const url = new URL(
      'https://t.adcell.com/p/click/extra?param0=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdcell(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/p/click?param0=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAdcell(url)).toBeUndefined()
  })
})
