import { describe, expect, it } from 'bun:test'
import { unwrapSerendipity } from './serendipity.js'

describe('unwrapSerendipity', () => {
  it('should extract the target from the exit tracker under a blog folder', () => {
    const url = new URL(
      'http://www.example.net/blog/exit.php?url=aHR0cDovL3d3dy5leGFtcGxlLmNvbS93YXRjaD92PXliamkwYXhwNnMwJmZlYXR1cmU9cmVsYXRlZA==&entry_id=455',
    )

    expect(unwrapSerendipity(url)).toBe(
      'http://www.example.com/watch?v=ybji0axp6s0&feature=related',
    )
  })

  it('should extract the target from the exit tracker at the root', () => {
    const url = new URL(
      'https://www.example.net/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=72',
    )

    expect(unwrapSerendipity(url)).toBe('https://www.example.com/')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://www.example.net/blog/exit.php?url=ZnRwOi8vZXhhbXBsZS5jb20vZmlsZS50eHQ=&entry_id=455',
    )

    expect(unwrapSerendipity(url)).toBeUndefined()
  })

  it('should return undefined for the exit tracker without entry_id', () => {
    const url = new URL(
      'http://www.example.net/track/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v',
    )

    expect(unwrapSerendipity(url)).toBeUndefined()
  })

  it('should return undefined for the exit tracker by url id', () => {
    const url = new URL('http://www.example.net/exit.php?url_id=12&entry_id=455')

    expect(unwrapSerendipity(url)).toBeUndefined()
  })

  it('should return undefined for the exit tracker two folders deep', () => {
    const url = new URL(
      'http://www.example.net/a/blog/exit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=455',
    )

    expect(unwrapSerendipity(url)).toBeUndefined()
  })

  it('should return undefined for another script', () => {
    const url = new URL(
      'http://www.example.net/blog/nwsexit.php?url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20v&entry_id=455',
    )

    expect(unwrapSerendipity(url)).toBeUndefined()
  })
})
