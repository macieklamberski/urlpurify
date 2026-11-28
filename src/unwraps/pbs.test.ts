import { describe, expect, it } from 'bun:test'
import { unwrapPbs } from './pbs.js'

describe('unwrapPbs', () => {
  it('should extract the target behind a show podcast prefix', () => {
    const value = new URL(
      'http://www.pbs.org/wgbh/nova/rss/podcast/redir/http://media.example.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3',
    )
    const expected = 'http://media.example.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3'

    expect(unwrapPbs(value)).toBe(expected)
  })

  it('should extract the target behind a one-segment prefix', () => {
    const value = new URL(
      'http://www.pbs.org/hplink/redir/http://distribution.example.net/video/NTV001/ntvjuicy001.mp4',
    )
    const expected = 'http://distribution.example.net/video/NTV001/ntvjuicy001.mp4'

    expect(unwrapPbs(value)).toBe(expected)
  })

  it('should return undefined for a target without a scheme', () => {
    const value = new URL('http://www.pbs.org/adbanners/juliachild/redir/www.example.org')

    expect(unwrapPbs(value)).toBeUndefined()
  })

  it('should return undefined for redir at the root', () => {
    const value = new URL('http://www.pbs.org/redir/http://www.example.org/episode.mp3')

    expect(unwrapPbs(value)).toBeUndefined()
  })

  it('should return undefined when a file name precedes the prefix', () => {
    const value = new URL(
      'http://www.pbs.org/wnet/index.html/rss/redir/http://www.example.org/episode.mp3',
    )

    expect(unwrapPbs(value)).toBeUndefined()
  })

  it('should return undefined for other paths', () => {
    const value = new URL('http://www.pbs.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3')

    expect(unwrapPbs(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/moyers/rss/redir/http://www.example.org/episode.mp3')

    expect(unwrapPbs(value)).toBeUndefined()
  })

  it('should decode an encoded target', () => {
    const value = new URL(
      'http://www.pbs.org/wgbh/nova/rss/podcast/redir/https%3A%2F%2Fexample.com%2Fepisode.mp3%3Fa%3D1',
    )
    const expected = 'https://example.com/episode.mp3?a=1'

    expect(unwrapPbs(value)).toBe(expected)
  })
})
