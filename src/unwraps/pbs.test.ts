import { describe, expect, it } from 'bun:test'
import { unwrapPbs } from './pbs.js'

describe('unwrapPbs', () => {
  it('should extract the target behind a show podcast prefix', () => {
    const url = new URL(
      'http://www.pbs.org/wgbh/nova/rss/podcast/redir/http://media.example.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3',
    )

    expect(unwrapPbs(url)).toBe(
      'http://media.example.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3',
    )
  })

  it('should extract the target behind a one-segment prefix', () => {
    const url = new URL(
      'http://www.pbs.org/hplink/redir/http://distribution.example.net/video/NTV001/ntvjuicy001.mp4',
    )

    expect(unwrapPbs(url)).toBe('http://distribution.example.net/video/NTV001/ntvjuicy001.mp4')
  })

  it('should return undefined for a target without a scheme', () => {
    const url = new URL('http://www.pbs.org/adbanners/juliachild/redir/www.example.org')

    expect(unwrapPbs(url)).toBeUndefined()
  })

  it('should return undefined for redir at the root', () => {
    const url = new URL('http://www.pbs.org/redir/http://www.example.org/episode.mp3')

    expect(unwrapPbs(url)).toBeUndefined()
  })

  it('should return undefined when a file name precedes the prefix', () => {
    const url = new URL(
      'http://www.pbs.org/wnet/index.html/rss/redir/http://www.example.org/episode.mp3',
    )

    expect(unwrapPbs(url)).toBeUndefined()
  })

  it('should return undefined for other paths', () => {
    const url = new URL('http://www.pbs.org/wgbh/nova/rss/media/nova_a_pod_dogs_100329.mp3')

    expect(unwrapPbs(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/moyers/rss/redir/http://www.example.org/episode.mp3')

    expect(unwrapPbs(url)).toBeUndefined()
  })
})
