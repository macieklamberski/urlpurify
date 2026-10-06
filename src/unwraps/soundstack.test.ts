import { describe, expect, it } from 'bun:test'
import { unwrapSoundstack } from './soundstack.js'

describe('unwrapSoundstack', () => {
  it('should extract a target after the account id and keep its query string', () => {
    const url = new URL(
      'https://enrichment.soundstack.com/4vjqq8/example.com/d/clips/566281f8-200e-4c9f-8378-a4870055423b/c7dfd105-1ae1-4b0c-b1df-a4df0058f38d/123bb48e-92b1-4a42-9dae-b4740187e591/audio.mp3?utm_source=Podcast&in_playlist=992',
    )

    expect(unwrapSoundstack(url)).toBe(
      'https://example.com/d/clips/566281f8-200e-4c9f-8378-a4870055423b/c7dfd105-1ae1-4b0c-b1df-a4df0058f38d/123bb48e-92b1-4a42-9dae-b4740187e591/audio.mp3?utm_source=Podcast&in_playlist=992',
    )
  })

  it('should return undefined when the account id has no target', () => {
    const url = new URL('https://enrichment.soundstack.com/4vjqq8/')

    expect(unwrapSoundstack(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://enrichment.soundstack.com/api/v1/example.com/episode.mp3')

    expect(unwrapSoundstack(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://soundstack.com/4vjqq8/example.com/episode.mp3')

    expect(unwrapSoundstack(url)).toBeUndefined()
  })

  it('should return undefined for a target with no account id', () => {
    const url = new URL('https://enrichment.soundstack.com/a.b.cd/episode.mp3')

    expect(unwrapSoundstack(url)).toBeUndefined()
  })

  it('should return undefined for an id below another segment', () => {
    const url = new URL('https://enrichment.soundstack.com/a/4vjqq8/example.com/episode.mp3')

    expect(unwrapSoundstack(url)).toBeUndefined()
  })
})
