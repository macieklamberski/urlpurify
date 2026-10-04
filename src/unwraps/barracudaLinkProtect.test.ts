import { describe, expect, it } from 'bun:test'
import { unwrapBarracudaLinkProtect } from './barracudaLinkProtect.js'

describe('unwrapBarracudaLinkProtect', () => {
  it('should extract target from a param', () => {
    const url = new URL(
      'https://linkprotect.cudasvc.com/url?a=http%3a%2f%2fwww.example.com%2f&c=E,1,26ZlzTAYlD22IOXPDDyTN_w56rCieL2OC70aiG_-7AL1n,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(url)).toBe('http://www.example.com/')
  })

  it('should extract target encoded with uppercase hex', () => {
    const url = new URL(
      'https://linkprotect.cudasvc.com/url?a=https%3A%2F%2Fexample.com%2Fstory&c=E,1,9vP4oZeSjezCkvuG9kMn9UeX,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(url)).toBe('https://example.com/story')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://linkprotect.cudasvc.com/url?a=https%3a%2f%2fexample.com%2fsearch%3fq%3dfeeds%26page%3d2&c=E,1,YrrVGfIy60QsN,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should return undefined when a param is missing', () => {
    const url = new URL('https://linkprotect.cudasvc.com/url?c=E,1,26ZlzTAYlD22IOXPDDyTN,,&typo=1')

    expect(unwrapBarracudaLinkProtect(url)).toBeUndefined()
  })

  it('should return undefined when a param is empty', () => {
    const url = new URL(
      'https://linkprotect.cudasvc.com/url?a=&c=E,1,26ZlzTAYlD22IOXPDDyTN,,&typo=1',
    )

    expect(unwrapBarracudaLinkProtect(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://linkprotect.cudasvc.com/?a=https%3a%2f%2fexample.com%2f')

    expect(unwrapBarracudaLinkProtect(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/url?a=https%3a%2f%2fexample.org%2f')

    expect(unwrapBarracudaLinkProtect(url)).toBeUndefined()
  })
})
