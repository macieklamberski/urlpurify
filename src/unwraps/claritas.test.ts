import { describe, expect, it } from 'bun:test'
import { unwrapClaritas } from './claritas.js'

describe('unwrapClaritas', () => {
  it('should extract a target from the measure prefix', () => {
    const value = new URL(
      'https://claritaspod.com/measure/example.com/d/clips/e73c998e/ff45d208/b4aa30b1/audio.mp3',
    )
    const expected = 'example.com/d/clips/e73c998e/ff45d208/b4aa30b1/audio.mp3'

    expect(unwrapClaritas(value)).toBe(expected)
  })

  it('should extract a target from the short prefix and keep its query string', () => {
    const value = new URL(
      'https://clrtpod.com/m/example.com/posts/8846823.mp3?modified=1769539012&source=rss',
    )
    const expected = 'example.com/posts/8846823.mp3?modified=1769539012&source=rss'

    expect(unwrapClaritas(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://claritaspod.com/measure/dts.podtrac.com/redirect.mp3/example.com/thewayiheardit/492_Jon_Erwin.mp3',
    )
    const expected = 'dts.podtrac.com/redirect.mp3/example.com/thewayiheardit/492_Jon_Erwin.mp3'

    expect(unwrapClaritas(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://clrtpod.com/m/')

    expect(unwrapClaritas(value)).toBeUndefined()
  })

  it('should return undefined for the short prefix on the long domain', () => {
    const value = new URL('https://claritaspod.com/m/example.com/episode.mp3')

    expect(unwrapClaritas(value)).toBeUndefined()
  })

  it('should return undefined for the measure prefix on the short domain', () => {
    const value = new URL('https://clrtpod.com/measure/example.com/episode.mp3')

    expect(unwrapClaritas(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/measure/example.org/episode.mp3')

    expect(unwrapClaritas(value)).toBeUndefined()
  })

  it('should return undefined for the short prefix on other hosts', () => {
    const value = new URL('https://example.com/m/example.org/episode.mp3')

    expect(unwrapClaritas(value)).toBeUndefined()
  })
})
