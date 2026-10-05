import { describe, expect, it } from 'bun:test'
import { unwrapConstantContact } from './constantContact.js'

describe('unwrapConstantContact', () => {
  it('should extract target from p param on a preview link', () => {
    const url = new URL(
      'http://r20.rs6.net/tn.jsp?t=wzxbzyyab.0.0.mdvaxecab.0&id=preview&r=3&p=http%3A%2F%2Fwww.example.com%2Fevents%2F2016-annual-fall-conference%2Fevent-summary',
    )

    expect(unwrapConstantContact(url)).toBe(
      'http://www.example.com/events/2016-annual-fall-conference/event-summary',
    )
  })

  it('should extract target from p param on a sent link', () => {
    const url = new URL(
      'http://r20.rs6.net/tn.jsp?t=lcq9n7lab.0.zwc4n7lab.u6ohqbdab.638&ts=S0854&p=http%3A%2F%2Fwww.example.com%2Fwhosmy.nsf%2FVGAMain%3Fopenform',
    )

    expect(unwrapConstantContact(url)).toBe('http://www.example.com/whosmy.nsf/VGAMain?openform')
  })

  it('should return undefined for a current link that holds only ids', () => {
    const url = new URL('https://r20.rs6.net/tn.jsp?f=001abc&c=xyz')

    expect(unwrapConstantContact(url)).toBeUndefined()
  })

  it('should return undefined for the open pixel', () => {
    const url = new URL(
      'http://r20.rs6.net/on.jsp?a=1102783429556&d=1117584226257&r=3&o=http://ui.example.com/images/p1x1.gif',
    )

    expect(unwrapConstantContact(url)).toBeUndefined()
  })

  it('should return undefined for the p param on another path', () => {
    const url = new URL('http://r20.rs6.net/error.jsp?p=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapConstantContact(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://www.example.com/tn.jsp?p=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapConstantContact(url)).toBeUndefined()
  })
})
