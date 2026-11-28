import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapToucharcade } from './toucharcade.js'

describe('unwrapToucharcade', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://toucharcade.com/link/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapToucharcade] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value = 'https://toucharcade.com/link/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapToucharcade] })).toBe(expected)
  })

  it('should extract the target from an outbound link', () => {
    const url = new URL(
      'http://toucharcade.com/link/http://itunes.example.com/us/app/hedgewars/id406787445',
    )

    expect(unwrapToucharcade(url)).toBe('http://itunes.example.com/us/app/hedgewars/id406787445')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://toucharcade.com/link/http://itunes.example.com/us/app/hedgewars/id406787445?mt=12#reviews',
    )

    expect(unwrapToucharcade(url)).toBe(
      'http://itunes.example.com/us/app/hedgewars/id406787445?mt=12#reviews',
    )
  })

  it('should return undefined for a link with no target', () => {
    const url = new URL('http://toucharcade.com/link/')

    expect(unwrapToucharcade(url)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const url = 'http://toucharcade.com/link/itms-apps://itunes.example.com/app/id406787445'

    expect(purifyUrl(url, { unwrappers: [unwrapToucharcade] })).toBe(url)
  })

  it('should return undefined for an article', () => {
    const url = new URL('https://toucharcade.com/2011/01/20/hedgewars/http://www.example.com/')

    expect(unwrapToucharcade(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/link/http://www.example.org/')

    expect(unwrapToucharcade(url)).toBeUndefined()
  })
})
