import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapSaleshandy } from './saleshandy.js'

describe('unwrapSaleshandy', () => {
  it('should extract target from r param', () => {
    const value = new URL('https://go.shztrk.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/')
    const expected = 'https://www.example.com/'

    expect(unwrapSaleshandy(value)).toBe(expected)
  })

  it('should extract target on a numbered shztrk.com host', () => {
    const value = new URL('https://lc2.shztrk.com/r/e/0jj7at2MBb3CnYZMw?r=https://www.example.com/')
    const expected = 'https://www.example.com/'

    expect(unwrapSaleshandy(value)).toBe(expected)
  })

  it('should extract target on a numbered shatrk.com host', () => {
    const value = new URL(
      'https://lc1.shatrk.com/r/e/5K2PEuBB3eKsqazbm?r=https://www.example.org/donate/robert',
    )
    const expected = 'https://www.example.org/donate/robert'

    expect(unwrapSaleshandy(value)).toBe(expected)
  })

  it('should extract target on a shetrk.com host', () => {
    const value = new URL('https://lc3.shetrk.com/r/e/BbKXaSAJap4SlGElP?r=https://www.example.org/')
    const expected = 'https://www.example.org/'

    expect(unwrapSaleshandy(value)).toBe(expected)
  })

  it('should return undefined when r param is missing', () => {
    const value = new URL('https://go.shztrk.com/r/e/e4zRlTbR7QxSmOMAA')

    expect(unwrapSaleshandy(value)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const value = new URL('https://go.shztrk.com/o/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/')

    expect(unwrapSaleshandy(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://lc1.shztrk.com.example.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/',
    )

    expect(unwrapSaleshandy(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const value = new URL(
      'https://examplelc1.shztrk.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/',
    )

    expect(unwrapSaleshandy(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapSaleshandy)).toBe(true)
  })
})
