import { describe, expect, it } from 'bun:test'
import { unwrapAnonymouse } from './anonymouse.js'

describe('unwrapAnonymouse', () => {
  it('should extract the target from the proxy script', () => {
    const url = new URL('http://anonymouse.org/cgi-bin/anon-www.cgi/http://www.example.co.uk/')

    expect(unwrapAnonymouse(url)).toBe('http://www.example.co.uk/')
  })

  it('should extract the target from the German proxy script', () => {
    const url = new URL(
      'http://anonymouse.org/cgi-bin/anon-www_de.cgi/http://www.example.fr/actualite/monde/article.html',
    )

    expect(unwrapAnonymouse(url)).toBe('http://www.example.fr/actualite/monde/article.html')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'http://anonymouse.org/cgi-bin/anon-www.cgi/http://www.example.com/bbs/bbs.cgi?id=7#top',
    )

    expect(unwrapAnonymouse(url)).toBe('http://www.example.com/bbs/bbs.cgi?id=7#top')
  })

  it('should return undefined for the proxy script with no target', () => {
    const url = new URL('http://anonymouse.org/cgi-bin/anon-www.cgi/')

    expect(unwrapAnonymouse(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('http://anonymouse.org/cgi-bin/anon-www.cgi/ftp://example.com/file.txt')

    expect(unwrapAnonymouse(url)).toBeUndefined()
  })

  it('should return undefined for another script on the host', () => {
    const url = new URL('http://anonymouse.org/cgi-bin/anon-email.cgi/http://www.example.com/')

    expect(unwrapAnonymouse(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('http://example.com/cgi-bin/anon-www.cgi/http://www.example.org/')

    expect(unwrapAnonymouse(url)).toBeUndefined()
  })
})
