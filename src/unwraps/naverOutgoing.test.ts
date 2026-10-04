import { describe, expect, it } from 'bun:test'
import { unwrapNaverOutgoing } from './naverOutgoing.js'

describe('unwrapNaverOutgoing', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'http://cc.loginfra.com/cc?a=sug.image&r=&i=&m=1&nsc=v.all&u=https://example.com/csrs-information/csrs',
    )

    expect(unwrapNaverOutgoing(url)).toBe('https://example.com/csrs-information/csrs')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('http://cc.loginfra.com/cc?a=sug.image')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://cc.loginfra.com/other?u=https://example.com/')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/cc?u=https://example.org/')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain no specimen shows', () => {
    const url = new URL('https://www.loginfra.com/cc?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapNaverOutgoing(url)).toBeUndefined()
  })
})
