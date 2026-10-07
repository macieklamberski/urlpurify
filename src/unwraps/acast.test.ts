import { describe, expect, it } from 'bun:test'
import { unwrapAcast } from './acast.js'

describe('unwrapAcast', () => {
  it('should extract a target without a scheme from the flex prefix', () => {
    const url = new URL(
      'https://flex2.acast.com/s/sillypodden/u/example.com/ab/vod/2026/09/d66razkf6ee5fxbgjhqt2/podcast_128.mp3',
    )

    expect(unwrapAcast(url)).toBe(
      'https://example.com/ab/vod/2026/09/d66razkf6ee5fxbgjhqt2/podcast_128.mp3',
    )
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'http://flex2.acast.com/s/60secondscience/u/example.com/podcast/podcast.mp3?fileId=E494E711-DF9E-4E97-85A8E55002611075',
    )

    expect(unwrapAcast(url)).toBe(
      'http://example.com/podcast/podcast.mp3?fileId=E494E711-DF9E-4E97-85A8E55002611075',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://flex2.acast.com/s/sillypodden/u/')

    expect(unwrapAcast(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://flex2.acast.com/s/sillypodden/example.com/podcast_128.mp3')

    expect(unwrapAcast(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/s/sillypodden/u/example.org/podcast_128.mp3')

    expect(unwrapAcast(url)).toBeUndefined()
  })
})
