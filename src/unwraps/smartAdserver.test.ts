import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapSmartAdserver } from './smartAdserver.js'

describe('unwrapSmartAdserver', () => {
  it('should extract target from go param on a numbered host', () => {
    const value = new URL(
      'https://www5.smartadserver.com/click?imgid=23364246&insid=8515221&pgid=712521&ckid=0&pubid=19&go=http%3a%2f%2fwww.example.com%2f',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapSmartAdserver(value)).toBe(expected)
  })

  it('should extract target from go param on a regional host', () => {
    const value = new URL(
      'https://euw2.smartadserver.com/click?imgid=41082439&insid=12913305&pgid=949833&fmtid=62983&pgDomain=https%3a%2f%2fwww.example.org%2f&go=https%3a%2f%2fwww.example.com%2foffre',
    )
    const expected = 'https://www.example.com/offre'

    expect(unwrapSmartAdserver(value)).toBe(expected)
  })

  it('should return undefined when go param is missing', () => {
    const value = new URL('https://www5.smartadserver.com/click?imgid=23364246&insid=8515221')

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the ad host', () => {
    const value = new URL(
      'https://www5.smartadserver.com/imp?imgid=23364246&go=http%3a%2f%2fwww.example.com%2f',
    )

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should return undefined for the cookie sync path', () => {
    const value = new URL(
      'https://ssbsync-global.smartadserver.com/api/sync?callerId=5&redirectUri=https://www.example.com/',
    )

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://www5.smartadserver.com.example.com/click?go=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a numbered prefix', () => {
    const value = new URL(
      'https://www5x.smartadserver.com/click?go=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with a numbered prefix', () => {
    const value = new URL(
      'https://xwww5.smartadserver.com/click?go=https%3a%2f%2fwww.example.org%2f',
    )

    expect(unwrapSmartAdserver(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapSmartAdserver)).toBe(true)
  })
})
