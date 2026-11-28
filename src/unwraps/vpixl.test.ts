import { describe, expect, it } from 'bun:test'
import { unwrapVpixl } from './vpixl.js'

describe('unwrapVpixl', () => {
  it('should extract a target without a scheme', () => {
    const value = new URL('https://pfx.vpixl.com/2FVSF4/example.com/secure/show/Innersoul.mp3')
    const expected = 'example.com/secure/show/Innersoul.mp3'

    expect(unwrapVpixl(value)).toBe(expected)
  })

  it('should keep a target without a scheme behind an http prefix', () => {
    const value = new URL('http://pfx.vpixl.com/7t0qx/example.com/episode.mp3')
    const expected = 'example.com/episode.mp3'

    expect(unwrapVpixl(value)).toBe(expected)
  })

  it('should keep the scheme of a target that carries one', () => {
    const value = new URL('https://pfx.vpixl.com/j0JIg/http://example.com/stream/1000582879.mp3')
    const expected = 'http://example.com/stream/1000582879.mp3'

    expect(unwrapVpixl(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL(
      'https://pfx.vpixl.com/kXP3j/example.com/CMGA5584445842.mp3?updated=1777342658',
    )
    const expected = 'example.com/CMGA5584445842.mp3?updated=1777342658'

    expect(unwrapVpixl(value)).toBe(expected)
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const value = new URL(
      'https://pfx.vpixl.com/kXP3j/chtbl.com/track/D86B8A/example.com/episode.mp3',
    )
    const expected = 'chtbl.com/track/D86B8A/example.com/episode.mp3'

    expect(unwrapVpixl(value)).toBe(expected)
  })

  it('should return undefined when the prefix has no target', () => {
    const value = new URL('https://pfx.vpixl.com/kXP3j/')

    expect(unwrapVpixl(value)).toBeUndefined()
  })

  it('should return undefined when the prefix has no id', () => {
    const value = new URL('https://pfx.vpixl.com/example.com/episodes/episode.mp3')

    expect(unwrapVpixl(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/kXP3j/example.org/episode.mp3')

    expect(unwrapVpixl(value)).toBeUndefined()
  })
})
