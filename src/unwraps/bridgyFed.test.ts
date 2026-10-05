import { describe, expect, it } from 'bun:test'
import { unwrapBridgyFed } from './bridgyFed.js'

describe('unwrapBridgyFed', () => {
  it('should extract target from a redirect to a web profile', () => {
    const url = new URL('https://fed.brid.gy/r/https://example.org')

    expect(unwrapBridgyFed(url)).toBe('https://example.org')
  })

  it('should extract target from a redirect to a bridged post', () => {
    const url = new URL(
      'https://bsky.brid.gy/r/https://example.com/profile/did:plc:muhesxre7yfcuqi5ss2fskjc/post/3ll3hevl32c2c',
    )

    expect(unwrapBridgyFed(url)).toBe(
      'https://example.com/profile/did:plc:muhesxre7yfcuqi5ss2fskjc/post/3ll3hevl32c2c',
    )
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://bsky.brid.gy/r/https://example.com/profile/did:plc:codfx2epdduamfycuyi5fjpb/post/3mfj5om3gtc2a?ref=example.org#replies',
    )

    expect(unwrapBridgyFed(url)).toBe(
      'https://example.com/profile/did:plc:codfx2epdduamfycuyi5fjpb/post/3mfj5om3gtc2a?ref=example.org#replies',
    )
  })

  it('should return undefined for a redirect with no target', () => {
    const url = new URL('https://fed.brid.gy/r/')

    expect(unwrapBridgyFed(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://fed.brid.gy/r/ftp://example.com/file')

    expect(unwrapBridgyFed(url)).toBeUndefined()
  })

  it('should return undefined for the render converter', () => {
    const url = new URL(
      'https://fed.brid.gy/render?source=https%3A%2F%2Fexample.com%2Fpost&target=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapBridgyFed(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/r/https://example.org/')

    expect(unwrapBridgyFed(url)).toBeUndefined()
  })
})
