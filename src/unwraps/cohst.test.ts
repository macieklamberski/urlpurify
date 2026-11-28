import { describe, expect, it } from 'bun:test'
import { unwrapCohst } from './cohst.js'

describe('unwrapCohst', () => {
  it('should extract a target without a scheme', () => {
    const value = new URL(
      'https://cohst.app/pdcst/4D2K3Z/mcdn.podbean.com/mf/web/5e6ly8/are-biologicals-the-future-of-ag.mp3',
    )
    const expected = 'mcdn.podbean.com/mf/web/5e6ly8/are-biologicals-the-future-of-ag.mp3'

    expect(unwrapCohst(value)).toBe(expected)
  })

  it('should keep a target without a scheme behind an http prefix', () => {
    const value = new URL('http://cohst.app/pdcst/4D2K3Z/example.com/episode.mp3')
    const expected = 'example.com/episode.mp3'

    expect(unwrapCohst(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL('https://cohst.app/pdcst/7G2Z3Q/example.com/episode.mp3?dest-id=431421')
    const expected = 'example.com/episode.mp3?dest-id=431421'

    expect(unwrapCohst(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL('https://cohst.app/pdcst/7C5L4R/mgln.ai/e/697/example.com/episode.mp3')
    const expected = 'mgln.ai/e/697/example.com/episode.mp3'

    expect(unwrapCohst(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://cohst.app/pdcst/4D2K3Z/')

    expect(unwrapCohst(value)).toBeUndefined()
  })

  it('should return undefined when the prefix has no id', () => {
    const value = new URL('https://cohst.app/pdcst/example.com/episode.mp3')

    expect(unwrapCohst(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the host', () => {
    const value = new URL('https://cohst.app/pdcsts/4D2K3Z/example.com/episode.mp3')

    expect(unwrapCohst(value)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const value = new URL('https://cohst.app/a/pdcst/4D2K3Z/example.com/episode.mp3')

    expect(unwrapCohst(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/pdcst/4D2K3Z/example.org/episode.mp3')

    expect(unwrapCohst(value)).toBeUndefined()
  })
})
