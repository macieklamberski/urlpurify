import { describe, expect, it } from 'bun:test'
import { unwrapPodup } from './podup.js'

describe('unwrapPodup', () => {
  it('should extract a target after the media prefix and drop the key param', () => {
    const url = new URL(
      'https://traffic.podup.com/media/storageapi.podup.com/production/821/1/blog/podcast/4df4875f-6205-489a-bc44-2e6cd26128d0.mp3?key=eyJkb21haW4iOiJleGFtcGxlLmNvbSIsInB0IjoicG9kY2FzdCIsInBzIjoiZXBpc29kZS0xIiwia3kiOjMxLCJ3aSI6MX0=',
    )

    expect(unwrapPodup(url)).toBe(
      'https://storageapi.podup.com/production/821/1/blog/podcast/4df4875f-6205-489a-bc44-2e6cd26128d0.mp3',
    )
  })

  it('should give the target https behind an http prefix', () => {
    const url = new URL(
      'http://traffic.podup.com/media/storageapi.podup.com/production/769/files/files/episode_1767740067401_810f5b0f.mp3',
    )

    expect(unwrapPodup(url)).toBe(
      'https://storageapi.podup.com/production/769/files/files/episode_1767740067401_810f5b0f.mp3',
    )
  })

  it('should drop a fragment', () => {
    const url = new URL('https://traffic.podup.com/media/example.com/episode.mp3#t=30')

    expect(unwrapPodup(url)).toBe('https://example.com/episode.mp3')
  })

  it('should return undefined when the media prefix has no target', () => {
    const url = new URL('https://traffic.podup.com/media/')

    expect(unwrapPodup(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://traffic.podup.com/other/example.com/episode.mp3')

    expect(unwrapPodup(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://storageapi.podup.com/media/example.com/episode.mp3')

    expect(unwrapPodup(url)).toBeUndefined()
  })
})
