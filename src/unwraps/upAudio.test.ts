import { describe, expect, it } from 'bun:test'
import { unwrapUpAudio } from './upAudio.js'

describe('unwrapUpAudio', () => {
  it('should extract a target and keep its query string', () => {
    const url = new URL(
      'https://prefix.up.audio/s/example.com/secure/theradiovagabond/Eng_369_-_ETF_Ric_Gazarian.mp3?dest-id=431421',
    )

    expect(unwrapUpAudio(url)).toBe(
      'https://example.com/secure/theradiovagabond/Eng_369_-_ETF_Ric_Gazarian.mp3?dest-id=431421',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL('https://prefix.up.audio/s/pdst.fm/e/example.com/episode.mp3')

    expect(unwrapUpAudio(url)).toBe('https://pdst.fm/e/example.com/episode.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://prefix.up.audio/s/')

    expect(unwrapUpAudio(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://prefix.up.audio/e/example.com/episode.mp3')

    expect(unwrapUpAudio(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://up.audio/s/example.com/episode.mp3')

    expect(unwrapUpAudio(url)).toBeUndefined()
  })
})
