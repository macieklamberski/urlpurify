import { describe, expect, it } from 'bun:test'
import { unwrapSoundOn } from './soundOn.js'

describe('unwrapSoundOn', () => {
  it('should extract a target without a scheme', () => {
    const url = new URL(
      'https://sw.soundon.fm/p/WJBXP2/example.com/d/1437767933/a2a4d3d1-b8dc-4db4-b6d9-013a5534a6f1.mp3',
    )

    expect(unwrapSoundOn(url)).toBe(
      'https://example.com/d/1437767933/a2a4d3d1-b8dc-4db4-b6d9-013a5534a6f1.mp3',
    )
  })

  it('should extract a target with a scheme', () => {
    const url = new URL('https://sw.soundon.fm/p/7OWIYL/http://example.com/stream/1278939313.mp3')

    expect(unwrapSoundOn(url)).toBe('http://example.com/stream/1278939313.mp3')
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://sw.soundon.fm/p/AY07T1/https://example.com/play.mp3?url=https%3A%2F%2Fexample.org%2Fep.mp3',
    )

    expect(unwrapSoundOn(url)).toBe(
      'https://example.com/play.mp3?url=https%3A%2F%2Fexample.org%2Fep.mp3',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://sw.soundon.fm/p/WJBXP2/')

    expect(unwrapSoundOn(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://sw.soundon.fm/x/WJBXP2/example.com/episode.mp3')

    expect(unwrapSoundOn(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/p/WJBXP2/example.org/episode.mp3')

    expect(unwrapSoundOn(url)).toBeUndefined()
  })
})
