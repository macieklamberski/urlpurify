import { describe, expect, it } from 'bun:test'
import { unwrapBridgyFed } from './bridgyFed.js'

describe('unwrapBridgyFed', () => {
  it('should extract target from a redirect to a web profile', () => {
    const value = new URL('https://fed.brid.gy/r/https://example.org')
    const expected = 'https://example.org'

    expect(unwrapBridgyFed(value)).toBe(expected)
  })

  it('should extract target from a redirect to a bridged post', () => {
    const value = new URL(
      'https://bsky.brid.gy/r/https://example.com/profile/did:plc:muhesxre7yfcuqi5ss2fskjc/post/3ll3hevl32c2c',
    )
    const expected =
      'https://example.com/profile/did:plc:muhesxre7yfcuqi5ss2fskjc/post/3ll3hevl32c2c'

    expect(unwrapBridgyFed(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://bsky.brid.gy/r/https://example.com/profile/did:plc:codfx2epdduamfycuyi5fjpb/post/3mfj5om3gtc2a?ref=example.org#replies',
    )
    const expected =
      'https://example.com/profile/did:plc:codfx2epdduamfycuyi5fjpb/post/3mfj5om3gtc2a?ref=example.org#replies'

    expect(unwrapBridgyFed(value)).toBe(expected)
  })

  it('should return undefined for a redirect with no target', () => {
    const value = new URL('https://fed.brid.gy/r/')

    expect(unwrapBridgyFed(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://fed.brid.gy/r/ftp://example.com/file')

    expect(unwrapBridgyFed(value)).toBeUndefined()
  })

  it('should return undefined for the render converter', () => {
    const value = new URL(
      'https://fed.brid.gy/render?source=https%3A%2F%2Fexample.com%2Fpost&target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapBridgyFed(value)).toBeUndefined()
  })

  it('should return undefined when the redirect path is not at the root', () => {
    const value = new URL('https://fed.brid.gy/convert/r/https://example.org/')

    expect(unwrapBridgyFed(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/r/https://example.org/')

    expect(unwrapBridgyFed(value)).toBeUndefined()
  })

  it('should decode an encoded target', () => {
    const value = new URL('https://fed.brid.gy/r/https%3A%2F%2Fexample.org%2Fpost%3Fa%3D1')
    const expected = 'https://example.org/post?a=1'

    expect(unwrapBridgyFed(value)).toBe(expected)
  })
})
