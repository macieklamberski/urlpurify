import { describe, expect, it } from 'bun:test'
import { unwrapWikizero } from './wikizero.js'

describe('unwrapWikizero', () => {
  it('should extract the target from the mirror', () => {
    const url = new URL(
      'http://www.wikizero.biz/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL0dhbWVfRGV2ZWxvcGVyc19Db25mZXJlbmNl',
    )

    expect(unwrapWikizero(url)).toBe('https://example.org/wiki/Game_Developers_Conference')
  })

  it('should extract a target holding base64url characters', () => {
    const url = new URL(
      'https://www.wikizeroo.org/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL0Jqw7Zyaz8-',
    )

    expect(unwrapWikizero(url)).toBe('https://example.org/wiki/Björk?>')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('http://www.wikizero.biz/index.php?q=ZnRwOi8vZXhhbXBsZS5vcmcvZmlsZS50eHQ')

    expect(unwrapWikizero(url)).toBeUndefined()
  })

  it('should return undefined for the mirror without q', () => {
    const url = new URL('http://www.wikizero.biz/index.php')

    expect(unwrapWikizero(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://www.wikizero.biz/search.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL01haW4',
    )

    expect(unwrapWikizero(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/index.php?q=aHR0cHM6Ly9leGFtcGxlLm9yZy93aWtpL01haW4')

    expect(unwrapWikizero(url)).toBeUndefined()
  })
})
