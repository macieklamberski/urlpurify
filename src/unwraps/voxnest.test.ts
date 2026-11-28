import { describe, expect, it } from 'bun:test'
import { unwrapVoxnest } from './voxnest.js'

describe('unwrapVoxnest', () => {
  it('should extract a target with a scheme', () => {
    const value = new URL(
      'http://audio.voxnest.com/stream/d5184782f6a447c68e27532c03f405b5/http://example.com/stream/931732846-the-unsigned-premiere-show.mp3',
    )
    const expected = 'http://example.com/stream/931732846-the-unsigned-premiere-show.mp3'

    expect(unwrapVoxnest(value)).toBe(expected)
  })

  it('should extract a target without a scheme', () => {
    const value = new URL(
      'https://audio.voxnest.com/stream/50df2568f6b64d2ca2517a08a285dd85/example.com/mf/web/r6kjhd/BTLO_HIGHLIGHTS_SUMMER_2019.mp3',
    )
    const expected = 'http://example.com/mf/web/r6kjhd/BTLO_HIGHLIGHTS_SUMMER_2019.mp3'

    expect(unwrapVoxnest(value)).toBe(expected)
  })

  it('should drop the link query, as the redirect does', () => {
    const value = new URL(
      'https://audio.voxnest.com/stream/bfa108d7d1734f23abc1ebd61d84fc38/example.com/listen/133bc670-8f90-4ce0-b57d-87a140c02712.mp3?source=rss&ext=asset.mp3',
    )
    const expected = 'http://example.com/listen/133bc670-8f90-4ce0-b57d-87a140c02712.mp3'

    expect(unwrapVoxnest(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://audio.voxnest.com/stream/50df2568f6b64d2ca2517a08a285dd85/')

    expect(unwrapVoxnest(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL(
      'https://audio.voxnest.com/embed/50df2568f6b64d2ca2517a08a285dd85/example.com/a.mp3',
    )

    expect(unwrapVoxnest(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/stream/50df2568f6b64d2ca2517a08a285dd85/example.org/a.mp3',
    )

    expect(unwrapVoxnest(value)).toBeUndefined()
  })
})
