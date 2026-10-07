import { describe, expect, it } from 'bun:test'
import { unwrapCohst } from './cohst.js'

describe('unwrapCohst', () => {
  it('should extract a target and give it https', () => {
    const url = new URL(
      'https://cohst.app/pdcst/4D2K3Z/mcdn.podbean.com/mf/web/5e6ly8/are-biologicals-the-future-of-ag.mp3',
    )

    expect(unwrapCohst(url)).toBe(
      'https://mcdn.podbean.com/mf/web/5e6ly8/are-biologicals-the-future-of-ag.mp3',
    )
  })

  it('should give https to a target behind an http prefix', () => {
    const url = new URL('http://cohst.app/pdcst/4D2K3Z/example.com/episode.mp3')

    expect(unwrapCohst(url)).toBe('https://example.com/episode.mp3')
  })

  it('should keep the target query string', () => {
    const url = new URL('https://cohst.app/pdcst/7G2Z3Q/example.com/episode.mp3?dest-id=431421')

    expect(unwrapCohst(url)).toBe('https://example.com/episode.mp3?dest-id=431421')
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL('https://cohst.app/pdcst/7C5L4R/mgln.ai/e/697/example.com/episode.mp3')

    expect(unwrapCohst(url)).toBe('https://mgln.ai/e/697/example.com/episode.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://cohst.app/pdcst/4D2K3Z/')

    expect(unwrapCohst(url)).toBeUndefined()
  })

  it('should return undefined when the prefix has no id', () => {
    const url = new URL('https://cohst.app/pdcst/example.com/episode.mp3')

    expect(unwrapCohst(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const url = new URL('https://cohst.app/pdcsts/4D2K3Z/example.com/episode.mp3')

    expect(unwrapCohst(url)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const url = new URL('https://cohst.app/a/pdcst/4D2K3Z/example.com/episode.mp3')

    expect(unwrapCohst(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/pdcst/4D2K3Z/example.org/episode.mp3')

    expect(unwrapCohst(url)).toBeUndefined()
  })
})
