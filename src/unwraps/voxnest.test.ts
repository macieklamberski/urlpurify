import { describe, expect, it } from 'bun:test'
import { unwrapVoxnest } from './voxnest.js'

describe('unwrapVoxnest', () => {
  it('should extract a target with a scheme', () => {
    const url = new URL(
      'http://audio.voxnest.com/stream/d5184782f6a447c68e27532c03f405b5/http://example.com/stream/931732846-the-unsigned-premiere-show.mp3',
    )

    expect(unwrapVoxnest(url)).toBe(
      'http://example.com/stream/931732846-the-unsigned-premiere-show.mp3',
    )
  })

  it('should extract a target without a scheme', () => {
    const url = new URL(
      'https://audio.voxnest.com/stream/50df2568f6b64d2ca2517a08a285dd85/example.com/mf/web/r6kjhd/BTLO_HIGHLIGHTS_SUMMER_2019.mp3',
    )

    expect(unwrapVoxnest(url)).toBe(
      'https://example.com/mf/web/r6kjhd/BTLO_HIGHLIGHTS_SUMMER_2019.mp3',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://audio.voxnest.com/stream/50df2568f6b64d2ca2517a08a285dd85/')

    expect(unwrapVoxnest(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL(
      'https://audio.voxnest.com/embed/50df2568f6b64d2ca2517a08a285dd85/example.com/a.mp3',
    )

    expect(unwrapVoxnest(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/stream/50df2568f6b64d2ca2517a08a285dd85/example.org/a.mp3',
    )

    expect(unwrapVoxnest(url)).toBeUndefined()
  })
})
