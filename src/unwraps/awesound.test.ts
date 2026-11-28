import { describe, expect, it } from 'bun:test'
import { unwrapAwesound } from './awesound.js'

describe('unwrapAwesound', () => {
  it('should extract the target from the click path', () => {
    const value = new URL(
      'https://awesound.com/click-auid/a6WQIbDd7T/https://example.com/how-to-run-a-small-business',
    )
    const expected = 'https://example.com/how-to-run-a-small-business'

    expect(unwrapAwesound(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://click.awesound.com/click-auid/tempauid/https://example.com/music/listen?u=0&pli=1#/ps/Ikp3aq',
    )
    const expected = 'https://example.com/music/listen?u=0&pli=1#/ps/Ikp3aq'

    expect(unwrapAwesound(value)).toBe(expected)
  })

  it('should return undefined for a target without a scheme', () => {
    const value = new URL('https://awesound.com/click-auid/a6WQIbDd7T/example.com/page')

    expect(unwrapAwesound(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://awesound.com/show/a6WQIbDd7T/https://example.com/page')

    expect(unwrapAwesound(value)).toBeUndefined()
  })

  it('should return undefined for the click path on another host', () => {
    const value = new URL('https://example.com/click-auid/a6WQIbDd7T/https://example.org/page')

    expect(unwrapAwesound(value)).toBeUndefined()
  })

  it('should decode an encoded target', () => {
    const value = new URL(
      'https://awesound.com/click-auid/a6WQIbDd7T/https%3A%2F%2Fexample.com%2Fepisode.mp3%3Fa%3D1',
    )
    const expected = 'https://example.com/episode.mp3?a=1'

    expect(unwrapAwesound(value)).toBe(expected)
  })
})
