import { describe, expect, it } from 'bun:test'
import { unwrapVpixl } from './vpixl.js'

describe('unwrapVpixl', () => {
  it('should extract a target and give it https', () => {
    const url = new URL('https://pfx.vpixl.com/2FVSF4/example.com/secure/show/Innersoul.mp3')

    expect(unwrapVpixl(url)).toBe('https://example.com/secure/show/Innersoul.mp3')
  })

  it('should give https to a target behind an http prefix', () => {
    const url = new URL('http://pfx.vpixl.com/7t0qx/example.com/episode.mp3')

    expect(unwrapVpixl(url)).toBe('https://example.com/episode.mp3')
  })

  it('should keep the scheme of a target that carries one', () => {
    const url = new URL('https://pfx.vpixl.com/j0JIg/http://example.com/stream/1000582879.mp3')

    expect(unwrapVpixl(url)).toBe('http://example.com/stream/1000582879.mp3')
  })

  it('should keep the target query string', () => {
    const url = new URL(
      'https://pfx.vpixl.com/kXP3j/example.com/CMGA5584445842.mp3?updated=1777342658',
    )

    expect(unwrapVpixl(url)).toBe('https://example.com/CMGA5584445842.mp3?updated=1777342658')
  })

  it('should leave the next prefix in a chain for the next pass', () => {
    const url = new URL(
      'https://pfx.vpixl.com/kXP3j/chtbl.com/track/D86B8A/example.com/episode.mp3',
    )

    expect(unwrapVpixl(url)).toBe('https://chtbl.com/track/D86B8A/example.com/episode.mp3')
  })

  it('should return undefined when the prefix has no target', () => {
    const url = new URL('https://pfx.vpixl.com/kXP3j/')

    expect(unwrapVpixl(url)).toBeUndefined()
  })

  it('should return undefined when the prefix has no id', () => {
    const url = new URL('https://pfx.vpixl.com/example.com/episodes/episode.mp3')

    expect(unwrapVpixl(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/kXP3j/example.org/episode.mp3')

    expect(unwrapVpixl(url)).toBeUndefined()
  })
})
