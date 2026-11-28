import { describe, expect, it } from 'bun:test'
import { unwrapUpAudio } from './upAudio.js'

describe('unwrapUpAudio', () => {
  it('should extract a target and keep its query string', () => {
    const value = new URL(
      'https://prefix.up.audio/s/example.com/secure/theradiovagabond/Eng_369_-_ETF_Ric_Gazarian.mp3?dest-id=431421',
    )
    const expected =
      'example.com/secure/theradiovagabond/Eng_369_-_ETF_Ric_Gazarian.mp3?dest-id=431421'

    expect(unwrapUpAudio(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL('https://prefix.up.audio/s/pdst.fm/e/example.com/episode.mp3')
    const expected = 'pdst.fm/e/example.com/episode.mp3'

    expect(unwrapUpAudio(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://prefix.up.audio/s/')

    expect(unwrapUpAudio(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://prefix.up.audio/e/example.com/episode.mp3')

    expect(unwrapUpAudio(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://up.audio/s/example.com/episode.mp3')

    expect(unwrapUpAudio(value)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const value = new URL('https://prefix.up.audio/a/s/example.com/episode.mp3')

    expect(unwrapUpAudio(value)).toBeUndefined()
  })
})
