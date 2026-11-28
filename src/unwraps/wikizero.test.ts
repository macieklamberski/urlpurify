import { describe, expect, it } from 'bun:test'
import { unwrapWikizero } from './wikizero.js'

describe('unwrapWikizero', () => {
  it('should extract the target from the mirror', () => {
    const value = new URL(
      'http://www.wikizero.biz/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL0dhbWVfRGV2ZWxvcGVyc19Db25mZXJlbmNl',
    )
    const expected = 'https://example.org/wiki/Game_Developers_Conference'

    expect(unwrapWikizero(value)).toBe(expected)
  })

  it('should extract a target holding base64url characters', () => {
    const value = new URL(
      'https://www.wikizeroo.org/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL0Jqw7Zyaz8-',
    )
    const expected = 'https://example.org/wiki/Björk?>'

    expect(unwrapWikizero(value)).toBe(expected)
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('http://www.wikizero.biz/index.php?q=ZnRwOi8vZXhhbXBsZS5vcmcvZmlsZS50eHQ')

    expect(unwrapWikizero(value)).toBeUndefined()
  })

  it('should return undefined for the mirror without q', () => {
    const value = new URL('http://www.wikizero.biz/index.php')

    expect(unwrapWikizero(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://www.wikizero.biz/search.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL01haW4',
    )

    expect(unwrapWikizero(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL01haW4')

    expect(unwrapWikizero(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://www.wikizero.biz/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL0dhbWVfRGV2ZWxvcGVyc19Db25mZXJlbmNlI3RvcA%3D%3D',
    )
    const expected = 'https://example.org/wiki/Game_Developers_Conference#top'

    expect(unwrapWikizero(value)).toBe(expected)
  })
})
