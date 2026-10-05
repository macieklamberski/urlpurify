import { describe, expect, it } from 'bun:test'
import { unwrapSaleshandy } from './saleshandy.js'

describe('unwrapSaleshandy', () => {
  it('should extract target from r param', () => {
    const url = new URL('https://go.shztrk.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/')

    expect(unwrapSaleshandy(url)).toBe('https://www.example.com/')
  })

  it('should extract target on a numbered shztrk.com host', () => {
    const url = new URL('https://lc2.shztrk.com/r/e/0jj7at2MBb3CnYZMw?r=https://www.example.com/')

    expect(unwrapSaleshandy(url)).toBe('https://www.example.com/')
  })

  it('should extract target on a numbered shatrk.com host', () => {
    const url = new URL(
      'https://lc1.shatrk.com/r/e/5K2PEuBB3eKsqazbm?r=https://www.example.org/donate/robert',
    )

    expect(unwrapSaleshandy(url)).toBe('https://www.example.org/donate/robert')
  })

  it('should return undefined when r param is missing', () => {
    const url = new URL('https://go.shztrk.com/r/e/e4zRlTbR7QxSmOMAA')

    expect(unwrapSaleshandy(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://go.shztrk.com/o/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/')

    expect(unwrapSaleshandy(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://lc1.shztrk.com.example.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/',
    )

    expect(unwrapSaleshandy(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const url = new URL(
      'https://examplelc1.shztrk.com/r/e/e4zRlTbR7QxSmOMAA?r=https://www.example.com/',
    )

    expect(unwrapSaleshandy(url)).toBeUndefined()
  })
})
