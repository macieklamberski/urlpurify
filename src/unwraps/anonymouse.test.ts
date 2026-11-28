import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapAnonymouse } from './anonymouse.js'

describe('unwrapAnonymouse', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://anonymouse.org/cgi-bin/anon-www.cgi/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapAnonymouse] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://anonymouse.org/cgi-bin/anon-www.cgi/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapAnonymouse] })).toBe(expected)
  })

  it('should extract the target from the proxy script', () => {
    const value = new URL('http://anonymouse.org/cgi-bin/anon-www.cgi/http://www.example.co.uk/')
    const expected = 'http://www.example.co.uk/'

    expect(unwrapAnonymouse(value)).toBe(expected)
  })

  it('should extract the target from the German proxy script', () => {
    const value = new URL(
      'http://anonymouse.org/cgi-bin/anon-www_de.cgi/http://www.example.fr/actualite/monde/article.html',
    )
    const expected = 'http://www.example.fr/actualite/monde/article.html'

    expect(unwrapAnonymouse(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'http://anonymouse.org/cgi-bin/anon-www.cgi/http://www.example.com/bbs/bbs.cgi?id=7#top',
    )
    const expected = 'http://www.example.com/bbs/bbs.cgi?id=7#top'

    expect(unwrapAnonymouse(value)).toBe(expected)
  })

  it('should return undefined for the proxy script with no target', () => {
    const value = new URL('http://anonymouse.org/cgi-bin/anon-www.cgi/')

    expect(unwrapAnonymouse(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'http://anonymouse.org/cgi-bin/anon-www.cgi/ftp://example.com/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapAnonymouse] })).toBe(value)
  })

  it('should return undefined for another script on the host', () => {
    const value = new URL('http://anonymouse.org/cgi-bin/anon-email.cgi/http://www.example.com/')

    expect(unwrapAnonymouse(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('http://example.com/cgi-bin/anon-www.cgi/http://www.example.org/')

    expect(unwrapAnonymouse(value)).toBeUndefined()
  })
})
