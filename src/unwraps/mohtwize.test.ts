import { describe, expect, it } from 'bun:test'
import { unwrapMohtwize } from './mohtwize.js'

describe('unwrapMohtwize', () => {
  it('should extract a target with a scheme', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/http://example.com/stream/1147457098-m-hhd-915464666-zdglagw8n17c.mp3',
    )
    const expected = 'http://example.com/stream/1147457098-m-hhd-915464666-zdglagw8n17c.mp3'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should extract a target without a scheme', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/example.com/d/1437767933/182e5948-08bb-4786-b0f6-4458aa92ffae/005399b9-2319-4fbd-ba38-a4276eb3d25c.mp3',
    )
    const expected =
      'https://example.com/d/1437767933/182e5948-08bb-4786-b0f6-4458aa92ffae/005399b9-2319-4fbd-ba38-a4276eb3d25c.mp3'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should keep the unencoded query of the target', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/example.com/764552/8175993-.mp3?blob_id=36919032&download=true',
    )
    const expected = 'https://example.com/764552/8175993-.mp3?blob_id=36919032&download=true'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should return undefined when the carrier has no target', () => {
    const value = new URL('https://stats.mohtwize.net/redirect.mp3?fileURL=/')

    expect(unwrapMohtwize(value)).toBeUndefined()
  })

  it('should return undefined for another param on the path', () => {
    const value = new URL('https://stats.mohtwize.net/redirect.mp3?file=/example.com/episode.mp3')

    expect(unwrapMohtwize(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://stats.mohtwize.net/redirect?fileURL=/example.com/episode.mp3')

    expect(unwrapMohtwize(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/redirect.mp3?fileURL=/example.org/episode.mp3')

    expect(unwrapMohtwize(value)).toBeUndefined()
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/example.com/episode.mp3#t=10',
    )
    const expected = 'https://example.com/episode.mp3#t=10'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should decode an encoded target', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/https%3A%2F%2Fexample.com%2Fepisode.mp3',
    )
    const expected = 'https://example.com/episode.mp3'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/https%3A%2F%2Fexample.com%2F%E0%A4%A',
    )
    const expected = 'https://example.com/%E0%A4%A'

    expect(unwrapMohtwize(value)).toBe(expected)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/https%3A%2F%2Fexample.com%2Fepisode.mp3%23top',
    )
    const expected = 'https://example.com/episode.mp3#top'

    expect(unwrapMohtwize(value)).toBe(expected)
  })
})
