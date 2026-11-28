import { describe, expect, it } from 'bun:test'
import { unwrapBizrate } from './bizrate.js'

describe('unwrapBizrate', () => {
  it('should extract the target from the rd subdomain', () => {
    const value = new URL(
      'http://rd.bizrate.com/rd?t=http%3A%2F%2Fwww.example.com%2FProductDetails.asp%3FProductCode%3DPSSC-B%26click%3D35&mid=120199&cat_id=10130500&atom=10340&prod_id=&oid=453512227&pos=1&b_id=18&bid_type=0&bamt=a5fedf14fd8fec0d&cobrand=1&ppr=bcc465eb96396663',
    )
    const expected = 'http://www.example.com/ProductDetails.asp?ProductCode=PSSC-B&click=35'

    expect(unwrapBizrate(value)).toBe(expected)
  })

  it('should extract an https target', () => {
    const value = new URL(
      'https://rd.bizrate.com/rd?t=https%3A%2F%2Fwww.example.com%2Fshoes%2F&mid=1',
    )
    const expected = 'https://www.example.com/shoes/'

    expect(unwrapBizrate(value)).toBe(expected)
  })

  it('should extract target when the t param comes last', () => {
    const value = new URL(
      'http://rd.bizrate.com/rd?mid=1&bamt=a5fedf14fd8fec0d&t=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapBizrate(value)).toBe(expected)
  })

  it('should return undefined when the t param is missing', () => {
    const value = new URL('http://rd.bizrate.com/rd?mid=120199&cat_id=10130500')

    expect(unwrapBizrate(value)).toBeUndefined()
  })

  it('should return undefined when the t param is empty', () => {
    const value = new URL('http://rd.bizrate.com/rd?t=&mid=120199')

    expect(unwrapBizrate(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const value = new URL('https://www.bizrate.com/shoes/?t=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBizrate(value)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const value = new URL('https://www.bizrate.com/')

    expect(unwrapBizrate(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/rd?t=http%3A%2F%2Fwww.example.org%2F&mid=1')

    expect(unwrapBizrate(value)).toBeUndefined()
  })
})
