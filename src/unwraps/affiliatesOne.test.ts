import { describe, expect, it } from 'bun:test'
import { unwrapAffiliatesOne } from './affiliatesOne.js'

describe('unwrapAffiliatesOne', () => {
  it('should extract target from t param', () => {
    const url = new URL(
      'https://track.affclkr.com/track/clicks/3724/c627c2b99a0520d6fa9cbd2e8d2b891473624cc970ecf0ab416db1026500?t=https%3A%2F%2Fwww.example.com%2Fpages%2Fvalentines-day-gift',
    )

    expect(unwrapAffiliatesOne(url)).toBe('https://www.example.com/pages/valentines-day-gift')
  })

  it('should extract target from t param after subid params', () => {
    const url = new URL(
      'https://affsrc.com/track/clicks/5340/c627c2bf9e0628d6fc8eec35dc2e9753743940cd75e4e1f2113ff40862075bee?subid_1=wordpress&subid_2=instagram&subid_3=podcast&t=https%3A%2F%2Fwww.example.com%2Fbasic%2F2012960041595',
    )

    expect(unwrapAffiliatesOne(url)).toBe('https://www.example.com/basic/2012960041595')
  })

  it('should extract a twice-encoded target from t param', () => {
    const url = new URL(
      'https://afftkr.site/track/clicks/3569/c627c2bc980728dcfb8aec23d62e964225664fdf2aabebf70266bb13210652aa8272f4?subid_1=hotel&t=https%253A%252F%252Fwww.example.com%252Fhotels%252Fdetail%253FhotelId%253D1',
    )

    expect(unwrapAffiliatesOne(url)).toBe('https://www.example.com/hotels/detail?hotelId=1')
  })

  it('should return undefined when t param is missing', () => {
    const url = new URL(
      'https://affsrc.com/track/clicks/5340/c627c2bf9e0628d6fc8eec35dc2e9753743940cd75e4e1f2113ff40862075bee?subid_1=wordpress',
    )

    expect(unwrapAffiliatesOne(url)).toBeUndefined()
  })

  it('should return undefined for a click path without the network prefix', () => {
    const url = new URL(
      'https://affsrc.com/track/clicks/5340/d1f2a3b9e0628d6fc8eec35dc2e9753743940cd75e4e1f2113ff408620?t=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAffiliatesOne(url)).toBeUndefined()
  })

  it('should return undefined for the click path on other hosts', () => {
    const url = new URL(
      'https://example.com/track/clicks/5340/c627c2bf9e0628d6fc8eec35dc2e9753743940cd75e4e1f2113ff40862075bee?t=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapAffiliatesOne(url)).toBeUndefined()
  })
})
