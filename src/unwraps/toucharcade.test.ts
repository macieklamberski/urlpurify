import { describe, expect, it } from 'bun:test'
import { unwrapToucharcade } from './toucharcade.js'

describe('unwrapToucharcade', () => {
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

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://toucharcade.com/link/itms-apps://itunes.example.com/app/id406787445',
    )

    expect(unwrapToucharcade(url)).toBeUndefined()
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
