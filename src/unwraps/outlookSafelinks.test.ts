import { describe, expect, it } from 'bun:test'
import { unwrapOutlookSafelinks } from './outlookSafelinks.js'

describe('unwrapOutlookSafelinks', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fstory&data=foo&sdata=bar&reserved=0',
    )

    expect(unwrapOutlookSafelinks(url)).toBe('https://example.com/story')
  })

  it('should extract target from a different tenant subdomain', () => {
    const url = new URL(
      'https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fstory&data=foo',
    )

    expect(unwrapOutlookSafelinks(url)).toBe('https://example.com/story')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://nam06.safelinks.protection.outlook.com/?data=foo')

    expect(unwrapOutlookSafelinks(url)).toBeUndefined()
  })

  it('should return undefined for non-Outlook hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapOutlookSafelinks(url)).toBeUndefined()
  })

  it('should extract target on the bare domain', () => {
    const url = new URL(
      'https://safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(url)).toBe('https://example.com/post')
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL(
      'https://examplesafelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://nam06.safelinks.protection.outlook.com/other?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(url)).toBeUndefined()
  })

  it('should extract target from an app link path', () => {
    const url = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/t-59584e83/?url=https%3A%2F%2Fexample.com%2Fmeet%2F33196825028634%3Fp%3DzPtq&data=05',
    )

    expect(unwrapOutlookSafelinks(url)).toBe('https://example.com/meet/33196825028634?p=zPtq')
  })

  it('should return undefined for another app path on the host', () => {
    const url = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/t/?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapOutlookSafelinks(url)).toBeUndefined()
  })

  it('should extract target from a multi-letter app kind', () => {
    const url = new URL(
      'https://eur01.safelinks.protection.outlook.com/ap/od-59584e83/?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapOutlookSafelinks(url)).toBe('https://example.com/post')
  })
})
