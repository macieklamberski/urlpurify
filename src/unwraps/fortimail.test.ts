import { describe, expect, it } from 'bun:test'
import { unwrapFortimail } from './fortimail.js'

describe('unwrapFortimail', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://gw000151-eu.fortimail.com/fmlurlsvc/?fewReq=:B:JVQwOz85MCx8NzgkOixjbjc6OzA6Oyx5Y21ka35/eG83azs+a28/bGgy&url=https%3a%2f%2fwww.example.com%2ffr%2f',
    )

    expect(unwrapFortimail(url)).toBe('https://www.example.com/fr/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.com/fmlurlsvc/?fewReq=:B:JVQwOz85MCx8NzgkOixjbjc6OzA6Oyx5Y21ka35/eG83azs+a28/bGgy&url=https%253A%252F%252Fexample.org%252Fpage',
    )

    expect(unwrapFortimail(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/fmlurlsvc/?fewReq=:B:JVQwOz85MCx8NzgkOixjbjc6OzA6Oyx5Y21ka35/eG83azs+a28/bGgy&url=https://example.org/search/a+b',
    )

    expect(unwrapFortimail(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://gw117178.fortimail.com/fmlurlsvc/?fewReq=:B:JV07MDQwOyd3PDMvMSdoZTwxMDsxMCdy&url=http://www.example.net/',
    )

    expect(unwrapFortimail(url)).toBe('http://www.example.net/')
  })

  it('should extract target on a customer gateway host', () => {
    const url = new URL(
      'https://spam.inserm.fr/fmlurlsvc/?fewReq=:B:JVQwOz86MCx8NzgkOixjbjc6OzA6Oyx5&url=https%3a%2f%2fcode.example.org%2fscience%2f',
    )

    expect(unwrapFortimail(url)).toBe('https://code.example.org/science/')
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL(
      'https://spam.inserm.fr/fmlurlsvc?fewReq=:B:JVQwOz86MCx8&url=https%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapFortimail(url)).toBeUndefined()
  })

  it('should return undefined without the fewReq param', () => {
    const url = new URL('https://spam.inserm.fr/fmlurlsvc/?url=https%3a%2f%2fwww.example.com%2f')

    expect(unwrapFortimail(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://spam.inserm.fr/fmlurlsvc/?fewReq=:B:JVQwOz86MCx8&url=javascript%3Aalert(1)',
    )

    expect(unwrapFortimail(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://spam.inserm.fr/fmlurlsvc/?fewReq=:B:JVQwOz86MCx8')

    expect(unwrapFortimail(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://spam.inserm.fr/fmlurlsvc/?fewReq=:B:JVQwOz86MCx8&url=')

    expect(unwrapFortimail(url)).toBeUndefined()
  })
})
