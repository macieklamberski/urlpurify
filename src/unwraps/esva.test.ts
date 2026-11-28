import { describe, expect, it } from 'bun:test'
import { unwrapEsva } from './esva.js'

describe('unwrapEsva', () => {
  it('should extract an https target', () => {
    const value = new URL(
      'https://urlsand.esvalabs.com/?u=https%3A%2F%2Fexample.com%2Fcareers%2F&e=4935d002&h=2f2f90a5&f=n&p=y',
    )
    const expected = 'https://example.com/careers/'

    expect(unwrapEsva(value)).toBe(expected)
  })

  it('should extract an http target', () => {
    const value = new URL(
      'https://urlsand.esvalabs.com/?u=http%3A%2F%2Fwww.example.org&e=19869936&h=ff16aed9&f=y&p=y&m=4gWH4Y4xgpzJmhP',
    )
    const expected = 'http://www.example.org'

    expect(unwrapEsva(value)).toBe(expected)
  })

  it('should extract target from a plain http wrapper', () => {
    const value = new URL(
      'http://urlsand.esvalabs.com/?u=https%3A%2F%2Fexample.com%2Fe%2Fr%3Fq%3DM3%253d0AM4K&e=a39aa7eb&h=8a955c38&f=y&p=y&l=1',
    )
    const expected = 'https://example.com/e/r?q=M3%3d0AM4K'

    expect(unwrapEsva(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://urlsand.esvalabs.com/?u=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2&e=4935d002&h=2f2f90a5&f=n&p=y',
    )
    const expected = 'https://example.com/search?q=feeds&page=2'

    expect(unwrapEsva(value)).toBe(expected)
  })

  it('should extract target when the u param comes last', () => {
    const value = new URL(
      'https://urlsand.esvalabs.com/?e=4935d002&h=2f2f90a5&f=n&p=y&u=https%3A%2F%2Fexample.com%2F',
    )
    const expected = 'https://example.com/'

    expect(unwrapEsva(value)).toBe(expected)
  })

  it('should return undefined when the u param is missing', () => {
    const value = new URL('https://urlsand.esvalabs.com/?e=4935d002&h=2f2f90a5&f=n&p=y')

    expect(unwrapEsva(value)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const value = new URL('https://urlsand.esvalabs.com/?u=&e=4935d002&h=2f2f90a5&f=n&p=y')

    expect(unwrapEsva(value)).toBeUndefined()
  })

  it('should return undefined for the root of the host without a query', () => {
    const value = new URL('https://urlsand.esvalabs.com/')

    expect(unwrapEsva(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://urlsand.esvalabs.com/scan?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapEsva(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/?u=https%3A%2F%2Fexample.org%2F&e=4935d002')

    expect(unwrapEsva(value)).toBeUndefined()
  })
})
