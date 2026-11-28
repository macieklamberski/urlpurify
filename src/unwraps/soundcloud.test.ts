import { describe, expect, it } from 'bun:test'
import { unwrapSoundcloud } from './soundcloud.js'

describe('unwrapSoundcloud', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://exit.sc/?url=https%3A%2F%2Fexample.com%2F')
    const expected = 'https://example.com/'

    expect(unwrapSoundcloud(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      'https://exit.sc/?url=https%3A%2F%2Fexample.com%2Fpodcast%2Fid1212422149%3Fmt%3D2',
    )
    const expected = 'https://example.com/podcast/id1212422149?mt=2'

    expect(unwrapSoundcloud(value)).toBe(expected)
  })

  it('should extract target when a token param follows', () => {
    const value = new URL(
      'https://exit.sc/?url=https%3A%2F%2Fexample.com%2Fwatch%3Fv%3DwBaqULRHsC8&token=973c3d-1-1556570137908',
    )
    const expected = 'https://example.com/watch?v=wBaqULRHsC8'

    expect(unwrapSoundcloud(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('https://exit.sc/?url=http://example.com/')
    const expected = 'http://example.com/'

    expect(unwrapSoundcloud(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://exit.sc/')

    expect(unwrapSoundcloud(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://exit.sc/?url=')

    expect(unwrapSoundcloud(value)).toBeUndefined()
  })

  it('should return undefined for other paths on exit.sc', () => {
    const value = new URL('https://exit.sc/other?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapSoundcloud(value)).toBeUndefined()
  })
})
