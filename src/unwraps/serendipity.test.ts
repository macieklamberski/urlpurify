import { describe, expect, it } from 'bun:test'
import { unwrapSerendipity } from './serendipity.js'

describe('unwrapSerendipity', () => {
  it('should extract the target from the exit tracker under a blog folder', () => {
    const value = new URL(
      'http://www.example.net/blog/exit.php?url=aHR0cDovL3d3dy5leGFtcGxlLmNvbS93YXRjaD92PXliamkwYXhwNnMwJmZlYXR1cmU9cmVsYXRlZA==&entry_id=455',
    )
    const expected = 'http://www.example.com/watch?v=ybji0axp6s0&feature=related'

    expect(unwrapSerendipity(value)).toBe(expected)
  })

  it('should extract the target from the exit tracker at the root', () => {
    const value = new URL(
      'https://www.example.net/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=72',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapSerendipity(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'http://www.example.net/blog/exit.php?url=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=&entry_id=455',
    )

    expect(unwrapSerendipity(value)).toBeUndefined()
  })

  it('should return undefined for the exit tracker without entry_id', () => {
    const value = new URL(
      'http://www.example.net/track/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapSerendipity(value)).toBeUndefined()
  })

  it('should return undefined for the exit tracker by url id', () => {
    const value = new URL('http://www.example.net/exit.php?url_id=12&entry_id=455')

    expect(unwrapSerendipity(value)).toBeUndefined()
  })

  it('should return undefined for the exit tracker two folders deep', () => {
    const value = new URL(
      'http://www.example.net/a/blog/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=455',
    )

    expect(unwrapSerendipity(value)).toBeUndefined()
  })

  it('should return undefined for another script', () => {
    const value = new URL(
      'http://www.example.net/blog/nwsexit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=455',
    )

    expect(unwrapSerendipity(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://www.example.net/blog/exit.php?url=aHR0cDovL3d3dy5leGFtcGxlLmNvbS93YXRjaD92PXliamkwYXhwNnMwJmZlYXR1cmU9cmVsYXRlZCN0b3A%3D&entry_id=455',
    )
    const expected = 'http://www.example.com/watch?v=ybji0axp6s0&feature=related#top'

    expect(unwrapSerendipity(value)).toBe(expected)
  })
})
