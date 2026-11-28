import { describe, expect, it } from 'bun:test'
import { unwrapPodup } from './podup.js'

describe('unwrapPodup', () => {
  it('should extract a target after the media prefix and drop the key param', () => {
    const value = new URL(
      'https://traffic.podup.com/media/storageapi.podup.com/production/821/1/blog/podcast/4df4875f-6205-489a-bc44-2e6cd26128d0.mp3?key=eyJkb21haW4iOiJleGFtcGxlLmNvbSIsInB0IjoicG9kY2FzdCIsInBzIjoiZXBpc29kZS0xIiwia3kiOjMxLCJ3aSI6MX0=',
    )
    const expected =
      'storageapi.podup.com/production/821/1/blog/podcast/4df4875f-6205-489a-bc44-2e6cd26128d0.mp3'

    expect(unwrapPodup(value)).toBe(expected)
  })

  it('should keep a target without a scheme behind an http prefix', () => {
    const value = new URL(
      'http://traffic.podup.com/media/storageapi.podup.com/production/769/files/files/episode_1767740067401_810f5b0f.mp3',
    )
    const expected =
      'storageapi.podup.com/production/769/files/files/episode_1767740067401_810f5b0f.mp3'

    expect(unwrapPodup(value)).toBe(expected)
  })

  it('should keep the link fragment', () => {
    const value = new URL('https://traffic.podup.com/media/example.com/episode.mp3#t=30')
    const expected = 'example.com/episode.mp3#t=30'

    expect(unwrapPodup(value)).toBe(expected)
  })

  it('should return undefined when the media prefix has no target', () => {
    const value = new URL('https://traffic.podup.com/media/')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for a path that resolves to no url', () => {
    const value = new URL('https://traffic.podup.com//')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for a path opening on a second slash', () => {
    const value = new URL('https://traffic.podup.com//example.com/media/episode.mp3')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://traffic.podup.com/other/example.com/episode.mp3')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://storageapi.podup.com/media/example.com/episode.mp3')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for the media path below another path', () => {
    const value = new URL('https://traffic.podup.com/other/media/example.com/episode.mp3')

    expect(unwrapPodup(value)).toBeUndefined()
  })

  it('should return undefined for a path that only starts with media', () => {
    const value = new URL('https://traffic.podup.com/mediafiles/example.com/episode.mp3')

    expect(unwrapPodup(value)).toBeUndefined()
  })
})
