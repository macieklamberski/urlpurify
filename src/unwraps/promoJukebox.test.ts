import { describe, expect, it } from 'bun:test'
import { unwrapPromoJukebox } from './promoJukebox.js'

describe('unwrapPromoJukebox', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://www.promojukebox.com/nwldel/link/?nlsendlistid=3780725&checkcode=5489f0010d139d91&urlcc=7a5dff6341a112de&url=https%3A%2F%2Feu.example.com%2Fen%2Fdeadly-vipers.html',
    )
    const expected = 'https://eu.example.com/en/deadly-vipers.html'

    expect(unwrapPromoJukebox(value)).toBe(expected)
  })

  it('should return undefined for a link carrying only acc', () => {
    const value = new URL(
      'https://www.promojukebox.com/nwldel/link/?nlsendlistid=13613660&checkcode=051d159e28d47304&urlcc=5ddddcb55a0cdc48&acc=a0RmenhHT2pLQ3FvUGQ5Y2FKODVic2hSaStyQmtiUUpHZFlaY0F6WXFjRT0%3D',
    )

    expect(unwrapPromoJukebox(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL(
      'https://www.promojukebox.com/nwldel/view/?nlsendlistid=3780725&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapPromoJukebox(value)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const value = new URL(
      'https://www.example.com/nwldel/link/?nlsendlistid=3780725&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapPromoJukebox(value)).toBeUndefined()
  })
})
