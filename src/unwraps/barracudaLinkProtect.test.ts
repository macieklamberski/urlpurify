import { describe, expect, it } from 'bun:test'
import { unwrapBarracudaLinkProtect } from './barracudaLinkProtect.js'

describe('unwrapBarracudaLinkProtect', () => {
  it('should extract target from a param', () => {
    const value = new URL(
      'https://linkprotect.cudasvc.com/url?a=http%3a%2f%2fwww.example.com%2f&c=E,1,26ZlzTAYlD22IOXPDDyTN_w56rCieL2OC70aiG_-7AL1n,,&typo=1',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapBarracudaLinkProtect(value)).toBe(expected)
  })

  it('should extract target encoded with uppercase hex', () => {
    const value = new URL(
      'https://linkprotect.cudasvc.com/url?a=https%3A%2F%2Fexample.com%2Fstory&c=E,1,9vP4oZeSjezCkvuG9kMn9UeX,,&typo=1',
    )
    const expected = 'https://example.com/story'

    expect(unwrapBarracudaLinkProtect(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fexample.com%2fsearch%3fq%3dfeeds%26page%3d2&c=E,1,YrrVGfIy60QsN,,&typo=1',
    )
    const expected = 'https://example.com/search?q=feeds&page=2'

    expect(unwrapBarracudaLinkProtect(value)).toBe(expected)
  })

  it('should return undefined when a param is missing', () => {
    const value = new URL(
      'https://linkprotect.cudasvc.com/url?c=E,1,26ZlzTAYlD22IOXPDDyTN,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })

  it('should return undefined when a param is empty', () => {
    const value = new URL(
      'https://linkprotect.cudasvc.com/url?a=&c=E,1,26ZlzTAYlD22IOXPDDyTN,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://linkprotect.cudasvc.com/?a=https%3a%2f%2fexample.com%2f')

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/url?a=https%3a%2f%2fexample.org%2f')

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplecudasvc.com/url?a=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://emea.linkprotect.cudasvc.com/url?a=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapBarracudaLinkProtect(value)).toBeUndefined()
  })
})
