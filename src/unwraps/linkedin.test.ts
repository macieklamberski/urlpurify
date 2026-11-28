import { describe, expect, it } from 'bun:test'
import { unwrapLinkedin } from './linkedin.js'

describe('unwrapLinkedin', () => {
  it('should extract target from /safety/go', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go?url=https%3A%2F%2Fexample.com%2Farticle&trk=flagship-messaging-web',
    )
    const expected = 'https://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go?url=https%253A%252F%252Fexample.org%252Fpage&trk=flagship-messaging-web',
    )
    const expected = 'https://example.org/page'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go?url=https://example.org/search/a+b&trk=flagship-messaging-web',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /safety/go/ with a trailing slash', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go/?url=https%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=MXRZ',
    )
    const expected = 'https://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /redir/redirect', () => {
    const value = new URL(
      'https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=v4oP',
    )
    const expected = 'https://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /redir/redirect/ with a trailing slash', () => {
    const value = new URL(
      'https://www.linkedin.com/redir/redirect/?url=https%3A%2F%2Fexample%2Ecom%2F&urlhash=v4oP&isSdui=true',
    )
    const expected = 'https://example.com/'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /redirect', () => {
    const value = new URL(
      'https://www.linkedin.com/redirect?url=http%3A%2F%2Fexample%2Ecom%2Ftalks%2Ehtml&urlhash=G3Ff&_t=tracking_anet',
    )
    const expected = 'http://example.com/talks.html'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /nhome/nus-redirect', () => {
    const value = new URL(
      'https://www.linkedin.com/nhome/nus-redirect?url=http%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=tQtC&pos=3%3A1',
    )
    const expected = 'http://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /nus-trk', () => {
    const value = new URL(
      'https://www.linkedin.com/nus-trk?trkact=viewShareLink&ut=NUS_UNIU_SHARE&url=http%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=cuei',
    )
    const expected = 'http://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /e/v2', () => {
    const value = new URL(
      'https://www.linkedin.com/e/v2?urlhash=miI9&url=https%3A%2F%2Fexample%2Ecom%2Farticle&midToken=AQF3_rJ-ffYOkA',
    )
    const expected = 'https://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /company/<id>/redirect with a numeric id', () => {
    const value = new URL(
      'https://www.linkedin.com/company/3129713/redirect?url=https%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=BAar',
    )
    const expected = 'https://example.com/article'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should extract target from /company/<id>/redirect with a slug id', () => {
    const value = new URL(
      'https://www.linkedin.com/company/example-inc-/redirect?url=http%3A%2F%2Fwww%2Eexample%2Ecom&urlhash=GCS5',
    )
    const expected = 'http://www.example.com'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should keep the query of an unencoded target', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go?url=https://example.com/watch?v=abc&trk=flagship-messaging-web',
    )
    const expected = 'https://example.com/watch?v=abc'

    expect(unwrapLinkedin(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://www.linkedin.com/safety/go?trk=flagship-messaging-web')

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://www.linkedin.com/redir/redirect?url=&urlhash=v4oP')

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined for the authwall return url', () => {
    const value = new URL(
      'https://www.linkedin.com/authwall?sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fexample',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const value = new URL(
      'https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined for the malware warning page', () => {
    const value = new URL(
      'https://www.linkedin.com/redir/general-malware-page?url=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined for the share intent', () => {
    const value = new URL('https://www.linkedin.com/shareArticle?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined for non-LinkedIn hosts', () => {
    const value = new URL('https://example.com/safety/go?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when a shim path is nested under another path', () => {
    const value = new URL(
      'https://www.linkedin.com/in/example/safety/go?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when a redirect path is nested under another path', () => {
    const value = new URL(
      'https://www.linkedin.com/in/example/company/example-inc/redirect?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when /safety/go has more segments', () => {
    const value = new URL(
      'https://www.linkedin.com/safety/go/example?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when /redirect has more segments', () => {
    const value = new URL(
      'https://www.linkedin.com/redirect/example?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when /company/<id>/redirect has more segments', () => {
    const value = new URL(
      'https://www.linkedin.com/company/example-inc/redirect/example?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })

  it('should return undefined when /company/<id>/redirect has two id segments', () => {
    const value = new URL(
      'https://www.linkedin.com/company/example-inc/life/redirect?url=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapLinkedin(value)).toBeUndefined()
  })
})
