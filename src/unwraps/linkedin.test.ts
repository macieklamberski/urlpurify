import { describe, expect, it } from 'bun:test'
import { unwrapLinkedin } from './linkedin.js'

describe('unwrapLinkedin', () => {
  it('should extract target from /safety/go', () => {
    const url = new URL(
      'https://www.linkedin.com/safety/go?url=https%3A%2F%2Fexample.com%2Farticle&trk=flagship-messaging-web',
    )

    expect(unwrapLinkedin(url)).toBe('https://example.com/article')
  })

  it('should extract target from /safety/go/ with a trailing slash', () => {
    const url = new URL(
      'https://www.linkedin.com/safety/go/?url=https%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=MXRZ',
    )

    expect(unwrapLinkedin(url)).toBe('https://example.com/article')
  })

  it('should extract target from /redir/redirect', () => {
    const url = new URL(
      'https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fexample%2Ecom%2Farticle&urlhash=v4oP',
    )

    expect(unwrapLinkedin(url)).toBe('https://example.com/article')
  })

  it('should extract target from /redir/redirect/ with a trailing slash', () => {
    const url = new URL(
      'https://www.linkedin.com/redir/redirect/?url=https%3A%2F%2Fexample%2Ecom%2F&urlhash=v4oP&isSdui=true',
    )

    expect(unwrapLinkedin(url)).toBe('https://example.com/')
  })

  it('should extract target from /redirect', () => {
    const url = new URL(
      'https://www.linkedin.com/redirect?url=http%3A%2F%2Fexample%2Ecom%2Ftalks%2Ehtml&urlhash=G3Ff&_t=tracking_anet',
    )

    expect(unwrapLinkedin(url)).toBe('http://example.com/talks.html')
  })

  it('should keep the query of an unencoded target', () => {
    const url = new URL(
      'https://www.linkedin.com/safety/go?url=https://example.com/watch?v=abc&trk=flagship-messaging-web',
    )

    expect(unwrapLinkedin(url)).toBe('https://example.com/watch?v=abc')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.linkedin.com/safety/go?trk=flagship-messaging-web')

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://www.linkedin.com/redir/redirect?url=&urlhash=v4oP')

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined for the authwall return url', () => {
    const url = new URL(
      'https://www.linkedin.com/authwall?sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fexample',
    )

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined for the login return url', () => {
    const url = new URL(
      'https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F',
    )

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined for the malware warning page', () => {
    const url = new URL(
      'https://www.linkedin.com/redir/general-malware-page?url=https%3A%2F%2Fexample%2Ecom%2F',
    )

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined for the share intent', () => {
    const url = new URL('https://www.linkedin.com/shareArticle?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapLinkedin(url)).toBeUndefined()
  })

  it('should return undefined for non-LinkedIn hosts', () => {
    const url = new URL('https://example.com/safety/go?url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapLinkedin(url)).toBeUndefined()
  })
})
