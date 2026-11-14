import { describe, expect, it } from 'bun:test'
import { unwrapAnytimePlayer } from './anytimePlayer.js'

describe('unwrapAnytimePlayer', () => {
  it('should extract a raw feed url', () => {
    const value = new URL(
      'https://anytimeplayer.app/subscribe?url=https://example.com/@rdgp/feed.xml',
    )
    const expected = 'https://example.com/@rdgp/feed.xml'

    expect(unwrapAnytimePlayer(value)).toBe(expected)
  })

  it('should extract a percent-encoded feed url', () => {
    const value = new URL(
      'https://anytimeplayer.app/subscribe?url=https%3A%2F%2Fexample.com%2F%40rdgp%2Ffeed.xml',
    )
    const expected = 'https://example.com/@rdgp/feed.xml'

    expect(unwrapAnytimePlayer(value)).toBe(expected)
  })

  it('should extract a twice-encoded feed url', () => {
    const value = new URL(
      'https://anytimeplayer.app/subscribe?url=https%253A%252F%252Fexample.com%252F%2540rdgp%252Ffeed.xml',
    )
    const expected = 'https://example.com/@rdgp/feed.xml'

    expect(unwrapAnytimePlayer(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://anytimeplayer.app/Subscribe?url=https://example.com/@rdgp/feed.xml',
    )
    const expected = 'https://example.com/@rdgp/feed.xml'

    expect(unwrapAnytimePlayer(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://anytimeplayer.app/subscribe')

    expect(unwrapAnytimePlayer(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://anytimeplayer.app/subscribe?url=')

    expect(unwrapAnytimePlayer(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://anytimeplayer.app/index.html?url=https://example.com/@rdgp/feed.xml',
    )

    expect(unwrapAnytimePlayer(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.app/subscribe?url=https://example.com/@rdgp/feed.xml')

    expect(unwrapAnytimePlayer(value)).toBeUndefined()
  })
})
