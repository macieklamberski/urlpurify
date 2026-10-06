import { describe, expect, it } from 'bun:test'
import { unwrapAwesound } from './awesound.js'

describe('unwrapAwesound', () => {
  it('should extract the target from the click path', () => {
    const url = new URL(
      'https://awesound.com/click-auid/a6WQIbDd7T/https://example.com/how-to-run-a-small-business',
    )

    expect(unwrapAwesound(url)).toBe('https://example.com/how-to-run-a-small-business')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://click.awesound.com/click-auid/tempauid/https://example.com/music/listen?u=0&pli=1#/ps/Ikp3aq',
    )

    expect(unwrapAwesound(url)).toBe('https://example.com/music/listen?u=0&pli=1#/ps/Ikp3aq')
  })

  it('should return undefined for a target without a scheme', () => {
    const url = new URL('https://awesound.com/click-auid/a6WQIbDd7T/example.com/page')

    expect(unwrapAwesound(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://awesound.com/show/a6WQIbDd7T/https://example.com/page')

    expect(unwrapAwesound(url)).toBeUndefined()
  })

  it('should return undefined for the click path on another host', () => {
    const url = new URL('https://example.com/click-auid/a6WQIbDd7T/https://example.org/page')

    expect(unwrapAwesound(url)).toBeUndefined()
  })
})
