import { describe, expect, it } from 'bun:test'
import { unwrapBizrate } from './bizrate.js'

describe('unwrapBizrate', () => {
  it('should extract the target from the rd subdomain', () => {
    const url = new URL(
      'http://rd.bizrate.com/rd?t=http%3A%2F%2Fwww.example.com%2FProductDetails.asp%3FProductCode%3DPSSC-B%26click%3D35&mid=120199&cat_id=10130500&atom=10340&prod_id=&oid=453512227&pos=1&b_id=18&bid_type=0&bamt=a5fedf14fd8fec0d&cobrand=1&ppr=bcc465eb96396663',
    )

    expect(unwrapBizrate(url)).toBe(
      'http://www.example.com/ProductDetails.asp?ProductCode=PSSC-B&click=35',
    )
  })

  it('should extract the target from the www host', () => {
    const url = new URL(
      'http://www.bizrate.com/rd?t=http%3A%2F%2Ftracking.example.com%2Fclick.asp%3Faid%3D757946125&mid=26581&cat_id=12100200&atom=10457&b_id=18&bamt=b0d1bfd60acd05fc',
    )

    expect(unwrapBizrate(url)).toBe('http://tracking.example.com/click.asp?aid=757946125')
  })

  it('should extract an https target', () => {
    const url = new URL(
      'https://rd.bizrate.com/rd?t=https%3A%2F%2Fwww.example.com%2Fshoes%2F&mid=1',
    )

    expect(unwrapBizrate(url)).toBe('https://www.example.com/shoes/')
  })

  it('should extract target when the t param comes last', () => {
    const url = new URL(
      'http://rd.bizrate.com/rd?mid=1&bamt=a5fedf14fd8fec0d&t=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapBizrate(url)).toBe('http://www.example.com/')
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('http://rd2.bizrate.com/rd?t=http%3A%2F%2Fwww.example.com%2F&mid=1')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined when the t param is missing', () => {
    const url = new URL('http://rd.bizrate.com/rd?mid=120199&cat_id=10130500')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined when the t param is empty', () => {
    const url = new URL('http://rd.bizrate.com/rd?t=&mid=120199')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL('https://www.bizrate.com/shoes/?t=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const url = new URL('https://www.bizrate.com/')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/rd?t=http%3A%2F%2Fwww.example.org%2F&mid=1')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('http://rd.notbizrate.com/rd?t=http%3A%2F%2Fwww.example.org%2F&mid=1')

    expect(unwrapBizrate(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain in its name', () => {
    const url = new URL('http://bizrate.com.example.net/rd?t=http%3A%2F%2Fwww.example.org%2F&mid=1')

    expect(unwrapBizrate(url)).toBeUndefined()
  })
})
