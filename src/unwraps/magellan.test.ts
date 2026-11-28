import { describe, expect, it } from 'bun:test'
import { unwrapMagellan } from './magellan.js'

describe('unwrapMagellan', () => {
  it('should extract a target without a scheme after a numeric id', () => {
    const value = new URL(
      'https://mgln.ai/e/12/example.com/CBC_TIO_P/media/tio/tio-55xtffJI-20260626.mp3',
    )
    const expected = 'example.com/CBC_TIO_P/media/tio/tio-55xtffJI-20260626.mp3'

    expect(unwrapMagellan(value)).toBe(expected)
  })

  it('should extract a target after a p-prefixed id', () => {
    const value = new URL(
      'https://mgln.ai/e/p653063/example.com/1911577/episodes/18759555-welcome.mp3',
    )
    const expected = 'example.com/1911577/episodes/18759555-welcome.mp3'

    expect(unwrapMagellan(value)).toBe(expected)
  })

  it('should extract a target with a scheme', () => {
    const value = new URL(
      'https://mgln.ai/e/p184171/http://example.com/stream/2387697174-thefilmstageshow.mp3',
    )
    const expected = 'http://example.com/stream/2387697174-thefilmstageshow.mp3'

    expect(unwrapMagellan(value)).toBe(expected)
  })

  it('should extract a target from the track prefix', () => {
    const value = new URL(
      'https://mgln.ai/track/example.com/episodes/d2870493-3581-423b-bf27-c4d1aa737522.mp3',
    )
    const expected = 'example.com/episodes/d2870493-3581-423b-bf27-c4d1aa737522.mp3'

    expect(unwrapMagellan(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL('https://mgln.ai/e/495/example.com/SBP3587695016.mp3?updated=1677879802')
    const expected = 'example.com/SBP3587695016.mp3?updated=1677879802'

    expect(unwrapMagellan(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://mgln.ai/e/495/')

    expect(unwrapMagellan(value)).toBeUndefined()
  })

  it('should return undefined for a target right after the host', () => {
    const value = new URL('https://mgln.ai/example.com/rss/p/WELII6539587850.mp3')

    expect(unwrapMagellan(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/e/495/example.org/episode.mp3')

    expect(unwrapMagellan(value)).toBeUndefined()
  })
})
