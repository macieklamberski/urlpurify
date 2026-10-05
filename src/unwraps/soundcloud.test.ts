import { describe, expect, it } from 'bun:test'
import { unwrapSoundcloud } from './soundcloud.js'

describe('unwrapSoundcloud', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://exit.sc/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapSoundcloud(url)).toBe('https://example.com/')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://exit.sc/?url=https%3A%2F%2Fexample.com%2Fpodcast%2Fid1212422149%3Fmt%3D2',
    )

    expect(unwrapSoundcloud(url)).toBe('https://example.com/podcast/id1212422149?mt=2')
  })

  it('should extract target when a token param follows', () => {
    const url = new URL(
      'https://exit.sc/?url=https%3A%2F%2Fexample.com%2Fwatch%3Fv%3DwBaqULRHsC8&token=973c3d-1-1556570137908',
    )

    expect(unwrapSoundcloud(url)).toBe('https://example.com/watch?v=wBaqULRHsC8')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('https://exit.sc/?url=http://example.com/')

    expect(unwrapSoundcloud(url)).toBe('http://example.com/')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://exit.sc/')

    expect(unwrapSoundcloud(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://exit.sc/?url=')

    expect(unwrapSoundcloud(url)).toBeUndefined()
  })

  it('should return undefined for other paths on exit.sc', () => {
    const url = new URL('https://exit.sc/other?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapSoundcloud(url)).toBeUndefined()
  })
})
