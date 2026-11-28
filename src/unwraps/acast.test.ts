import { describe, expect, it } from 'bun:test'
import { unwrapAcast } from './acast.js'

describe('unwrapAcast', () => {
  it('should extract a target without a scheme from the flex prefix', () => {
    const value = new URL(
      'https://flex2.acast.com/s/sillypodden/u/example.com/ab/vod/2026/09/d66razkf6ee5fxbgjhqt2/podcast_128.mp3',
    )
    const expected = 'https://example.com/ab/vod/2026/09/d66razkf6ee5fxbgjhqt2/podcast_128.mp3'

    expect(unwrapAcast(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL(
      'http://flex2.acast.com/s/60secondscience/u/example.com/podcast/podcast.mp3?fileId=E494E711-DF9E-4E97-85A8E55002611075',
    )
    const expected =
      'http://example.com/podcast/podcast.mp3?fileId=E494E711-DF9E-4E97-85A8E55002611075'

    expect(unwrapAcast(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://flex2.acast.com/s/sillypodden/u/')

    expect(unwrapAcast(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://flex2.acast.com/s/sillypodden/example.com/podcast_128.mp3')

    expect(unwrapAcast(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/s/sillypodden/u/example.org/podcast_128.mp3')

    expect(unwrapAcast(value)).toBeUndefined()
  })
})
