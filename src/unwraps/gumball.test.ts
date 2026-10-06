import { describe, expect, it } from 'bun:test'
import { unwrapGumball } from './gumball.js'

describe('unwrapGumball', () => {
  it('should extract a target that follows the host', () => {
    const url = new URL('https://2.gum.fm/example.com/e/media.transistor.fm/3f064696/a5c0bb98.mp3')

    expect(unwrapGumball(url)).toBe(
      'https://example.com/e/media.transistor.fm/3f064696/a5c0bb98.mp3',
    )
  })

  it('should extract a target after the show id and keep its query string', () => {
    const url = new URL(
      'https://s.gum.fm/s-611319b4bd3dc100237cd71c/example.com/episodes/7e2d7a26-bab4-4ee3-b7f7-552c91968a7e.mp3?rss_browser=BAhJIgtDaHJvbWUGOgZFVA%3D%3D',
    )

    expect(unwrapGumball(url)).toBe(
      'https://example.com/episodes/7e2d7a26-bab4-4ee3-b7f7-552c91968a7e.mp3?rss_browser=BAhJIgtDaHJvbWUGOgZFVA%3D%3D',
    )
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL('https://2.gum.fm/op3.dev/e/pdcn.co/e/example.com/16ed6449/ad534b2c.mp3')

    expect(unwrapGumball(url)).toBe('https://op3.dev/e/pdcn.co/e/example.com/16ed6449/ad534b2c.mp3')
  })

  it('should return undefined when the first segment is not a host', () => {
    const url = new URL('https://2.gum.fm/about/')

    expect(unwrapGumball(url)).toBeUndefined()
  })

  it('should return undefined for a file at the root', () => {
    const url = new URL('https://2.gum.fm/favicon.ico')

    expect(unwrapGumball(url)).toBeUndefined()
  })

  it('should return undefined when the show prefix has no target', () => {
    const url = new URL('https://s.gum.fm/s-611319b4bd3dc100237cd71c/')

    expect(unwrapGumball(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the show host', () => {
    const url = new URL('https://s.gum.fm/r1/0123testrss/example.com/audio/episode4.mp3')

    expect(unwrapGumball(url)).toBeUndefined()
  })

  it('should return undefined when the show id is not 24 hex characters', () => {
    const url = new URL('https://s.gum.fm/s-feed/example.com/episode.mp3')

    expect(unwrapGumball(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/s-611319b4bd3dc100237cd71c/example.org/episode.mp3')

    expect(unwrapGumball(url)).toBeUndefined()
  })
})
