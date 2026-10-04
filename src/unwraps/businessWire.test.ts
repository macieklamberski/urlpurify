import { describe, expect, it } from 'bun:test'
import { unwrapBusinessWire } from './businessWire.js'

describe('unwrapBusinessWire', () => {
  it('should extract target from a tracker link', () => {
    const url = new URL(
      'https://cts.businesswire.com/ct/CT?id=smartlink&url=https%3A%2F%2Fexample.com%2F&esheet=54545904&newsitemid=20260602907844&lan=en-US&anchor=Example&index=1&md5=f8a229f7101d1888198a1bff449f8b45',
    )

    expect(unwrapBusinessWire(url)).toBe('https://example.com/')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://cts.businesswire.com/ct/CT?id=smartlink&url=https%3A%2F%2Fexample.com%2Fbrands%2F%3Fana%3Dfooter%23contact&esheet=53401648&lan=en-US&index=5&md5=8698659833f27148e3f7ae4007efc984',
    )

    expect(unwrapBusinessWire(url)).toBe('https://example.com/brands/?ana=footer#contact')
  })

  it('should extract target from an http tracker link', () => {
    const url = new URL(
      'http://cts.businesswire.com/ct/CT?id=smartlink&url=http%3A%2F%2Fexample.com&esheet=53540639&lan=en-US&index=6&md5=75b04bee0d78d069d0c559fce92d6f1e',
    )

    expect(unwrapBusinessWire(url)).toBe('http://example.com')
  })

  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'https://cts.businesswire.com/ct/CT?id=smartlink&url=https%253A%252F%252Fexample.com%252Feducate%252F%2523report&esheet=52129700&lan=en-US&index=2&md5=7b83a2b78cb23db57081fd0da2c56fc7',
    )

    expect(unwrapBusinessWire(url)).toBe('https://example.com/educate/#report')
  })

  it('should extract an uppercase twice-encoded target', () => {
    const url = new URL(
      'https://cts.businesswire.com/ct/CT?id=smartlink&url=HTTPS%253A%252F%252Fexample.com%252F',
    )

    expect(unwrapBusinessWire(url)).toBe('HTTPS://example.com/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://cts.businesswire.com/ct/CT?id=smartlink&esheet=54545904&index=1')

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://cts.businesswire.com/ct/CT?id=smartlink&url=javascript%3Aalert(1)')

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })

  it('should return undefined for a malformed twice-encoded target', () => {
    const url = new URL(
      'https://cts.businesswire.com/ct/CT?id=smartlink&url=https%253A%252F%252Fexample.com%25',
    )

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL('https://cts.businesswire.com/ct/other?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })

  it('should return undefined for the newsroom host', () => {
    const url = new URL('https://www.businesswire.com/news/home/20260602907844/en/')

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/ct/CT?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapBusinessWire(url)).toBeUndefined()
  })
})
