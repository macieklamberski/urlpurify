import { describe, expect, it } from 'bun:test'
import { unwrapBuybox } from './buybox.js'

describe('unwrapBuybox', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://go.buybox.click/linkclick_3683_16?&url=https%3A%2F%2Fwww.example.com%2Fs%2Fswieto-epapieru',
    )
    const expected = 'https://www.example.com/s/swieto-epapieru'

    expect(unwrapBuybox(value)).toBe(expected)
  })

  it('should extract target from url param after a p1 sub-id', () => {
    const value = new URL(
      'https://go.buybox.click/linkclick_2894_309?p1=Mybasic%20czapka&url=https%3A%2F%2Fwww.example.com%2Fp%2Fczapka-do01205',
    )
    const expected = 'https://www.example.com/p/czapka-do01205'

    expect(unwrapBuybox(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://go.buybox.click/linkclick_3683_16?p1=czapka')

    expect(unwrapBuybox(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Buybox host', () => {
    const value = new URL(
      'https://go.buybox.click/linkview_3683_16?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapBuybox(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/linkclick_3683_16?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapBuybox(value)).toBeUndefined()
  })
})
