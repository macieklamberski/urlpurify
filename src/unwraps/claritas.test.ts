import { describe, expect, it } from 'bun:test'
import { unwrapClaritas } from './claritas.js'

describe('unwrapClaritas', () => {
  it('should extract a target from the measure prefix', () => {
    const url = new URL(
      'https://claritaspod.com/measure/example.com/d/clips/e73c998e/ff45d208/b4aa30b1/audio.mp3',
    )

    expect(unwrapClaritas(url)).toBe(
      'https://example.com/d/clips/e73c998e/ff45d208/b4aa30b1/audio.mp3',
    )
  })

  it('should extract a target from the short prefix and keep its query string', () => {
    const url = new URL(
      'https://clrtpod.com/m/example.com/posts/8846823.mp3?modified=1769539012&source=rss',
    )

    expect(unwrapClaritas(url)).toBe(
      'https://example.com/posts/8846823.mp3?modified=1769539012&source=rss',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://claritaspod.com/measure/dts.podtrac.com/redirect.mp3/example.com/thewayiheardit/492_Jon_Erwin.mp3',
    )

    expect(unwrapClaritas(url)).toBe(
      'https://dts.podtrac.com/redirect.mp3/example.com/thewayiheardit/492_Jon_Erwin.mp3',
    )
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://clrtpod.com/m/')

    expect(unwrapClaritas(url)).toBeUndefined()
  })

  it('should return undefined for the other host prefix', () => {
    const url = new URL('https://claritaspod.com/m/example.com/episode.mp3')

    expect(unwrapClaritas(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/measure/example.org/episode.mp3')

    expect(unwrapClaritas(url)).toBeUndefined()
  })
})
