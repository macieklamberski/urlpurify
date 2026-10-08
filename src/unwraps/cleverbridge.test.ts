import { describe, expect, it } from 'bun:test'
import { unwrapCleverbridge } from './cleverbridge.js'

describe('unwrapCleverbridge', () => {
  it('should extract target from redirectto param', () => {
    const url = new URL(
      'https://store.hide.me/1034/cookie?affiliate=46217&expiry=45&redirectto=https%3A%2F%2Fwww.example.com%2Fen%2Fpricing%3Fhidefree%3D1%26cb%3D46217',
    )

    expect(unwrapCleverbridge(url)).toBe('https://www.example.com/en/pricing?hidefree=1&cb=46217')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/1034/cookie?affiliate=46217&expiry=45&redirectto=https://example.org/search/a+b',
    )

    expect(unwrapCleverbridge(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract a target with lowercase percent-encoding', () => {
    const url = new URL(
      'https://secure.piriform.com/502/cookie?affiliate=21030&redirectto=http%3a%2f%2fwww.example.com%2fspeccy%2fdownload%2fstandard&product=71030',
    )

    expect(unwrapCleverbridge(url)).toBe('http://www.example.com/speccy/download/standard')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://shop.ashampoo.com/10/cookie?affiliate=10605&redirectto=http://www.example.com/winoptimizer_9_sm.exe&product=92049',
    )

    expect(unwrapCleverbridge(url)).toBe('http://www.example.com/winoptimizer_9_sm.exe')
  })

  it('should extract target beside redirecthash', () => {
    const url = new URL(
      'https://store.malwarebytes.org/342/cookie?affiliate=21030&redirectto=http%3a%2f%2fdata-cdn.example.com%2fmbam-setup.exe&redirecthash=1A6161BCE54E460E4F1BCB6653773911&product=59393',
    )

    expect(unwrapCleverbridge(url)).toBe('http://data-cdn.example.com/mbam-setup.exe')
  })

  it('should return undefined for another path on the store host', () => {
    const url = new URL(
      'https://store.hide.me/1034/purl-hideme?affiliate=46217&redirectto=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })

  it('should return undefined for the path under a prefix', () => {
    const url = new URL(
      'https://store.hide.me/en/1034/cookie?affiliate=46217&redirectto=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })

  it('should return undefined without the affiliate param', () => {
    const url = new URL(
      'https://store.hide.me/1034/cookie?redirectto=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://store.hide.me/1034/cookie?affiliate=46217&redirectto=javascript%3Aalert(1)',
    )

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })

  it('should return undefined when redirectto param is missing', () => {
    const url = new URL('https://store.hide.me/1034/cookie?affiliate=46217&expiry=45')

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })

  it('should return undefined when redirectto param is empty', () => {
    const url = new URL('https://store.hide.me/1034/cookie?affiliate=46217&redirectto=')

    expect(unwrapCleverbridge(url)).toBeUndefined()
  })
})
