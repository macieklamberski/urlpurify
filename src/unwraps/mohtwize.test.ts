import { describe, expect, it } from 'bun:test'
import { unwrapMohtwize } from './mohtwize.js'

describe('unwrapMohtwize', () => {
  it('should extract a target with a scheme', () => {
    const url = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/http://example.com/stream/1147457098-m-hhd-915464666-zdglagw8n17c.mp3',
    )

    expect(unwrapMohtwize(url)).toBe(
      'http://example.com/stream/1147457098-m-hhd-915464666-zdglagw8n17c.mp3',
    )
  })

  it('should extract a target without a scheme', () => {
    const url = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/example.com/d/1437767933/182e5948-08bb-4786-b0f6-4458aa92ffae/005399b9-2319-4fbd-ba38-a4276eb3d25c.mp3',
    )

    expect(unwrapMohtwize(url)).toBe(
      'https://example.com/d/1437767933/182e5948-08bb-4786-b0f6-4458aa92ffae/005399b9-2319-4fbd-ba38-a4276eb3d25c.mp3',
    )
  })

  it('should keep the unencoded query of the target', () => {
    const url = new URL(
      'https://stats.mohtwize.net/redirect.mp3?fileURL=/example.com/764552/8175993-.mp3?blob_id=36919032&download=true',
    )

    expect(unwrapMohtwize(url)).toBe(
      'https://example.com/764552/8175993-.mp3?blob_id=36919032&download=true',
    )
  })

  it('should return undefined when the carrier has no target', () => {
    const url = new URL('https://stats.mohtwize.net/redirect.mp3?fileURL=/')

    expect(unwrapMohtwize(url)).toBeUndefined()
  })

  it('should return undefined for another param on the path', () => {
    const url = new URL('https://stats.mohtwize.net/redirect.mp3?file=/example.com/episode.mp3')

    expect(unwrapMohtwize(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://stats.mohtwize.net/redirect?fileURL=/example.com/episode.mp3')

    expect(unwrapMohtwize(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/redirect.mp3?fileURL=/example.org/episode.mp3')

    expect(unwrapMohtwize(url)).toBeUndefined()
  })
})
