import { describe, expect, it } from 'bun:test'
import { unwrapWordpressEmail } from './wordpressEmail.js'

describe('unwrapWordpressEmail', () => {
  it('should extract the target from the redirect_to param', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click&redirect_to=https%3A%2F%2Fexample.com%2F2026%2F03%2F23%2Fa-post%2F&sr=1&signature=46c961189d54957bc95c7dbbd0b2b871&user=25590151&_e=eyJlcnJvciI6bnVsbH0&_z=z',
    )

    expect(unwrapWordpressEmail(url)).toBe('https://example.com/2026/03/23/a-post/')
  })

  it('should extract the target of a comment action', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click&redirect_to=https%3A%2F%2Fexample.com%2Fcomment%2Fexample.org%2F235%3Faction%3Dapprove&sr=1&signature=46c961189d54957bc95c7dbbd0b2b871&user=25590151&blog_id=25709067',
    )

    expect(unwrapWordpressEmail(url)).toBe(
      'https://example.com/comment/example.org/235?action=approve',
    )
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click&redirect_to=https://example.com/2019/04/01/a-post/&sr=1&signature=fea8435950d2040228e7056fb15469b9&user=13df99b3aeb2702e41768973ea3a0951',
    )

    expect(unwrapWordpressEmail(url)).toBe('https://example.com/2019/04/01/a-post/')
  })

  it('should extract the target when the redirect_to param comes first', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?redirect_to=https%3A%2F%2Fexample.com%2F&stat=groovemails-events&bin=wpcom_email_click',
    )

    expect(unwrapWordpressEmail(url)).toBe('https://example.com/')
  })

  it('should extract the target of a plain http wrapper', () => {
    const url = new URL(
      'http://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click&redirect_to=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapWordpressEmail(url)).toBe('https://example.com/')
  })

  it('should return undefined when the redirect_to param is missing', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined when the redirect_to param is empty', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/?stat=groovemails-events&bin=wpcom_email_click&redirect_to=',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for the login page that takes a return url', () => {
    const url = new URL('https://wordpress.com/log-in?redirect_to=https%3A%2F%2Fexample.com%2F')

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path on the host', () => {
    const url = new URL(
      'https://public-api.wordpress.com/rest/v1.1/me?redirect_to=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for the bar path without the trailing slash', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar?redirect_to=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for a path below the bar path', () => {
    const url = new URL(
      'https://public-api.wordpress.com/bar/x?redirect_to=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for the shape on a blog subdomain', () => {
    const url = new URL(
      'https://example.wordpress.com/bar/?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for a subdomain of the host', () => {
    const url = new URL(
      'https://example.public-api.wordpress.com/bar/?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/bar/?redirect_to=https%3A%2F%2Fexample.org%2F')

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://public-api.wordpress.example.net/bar/?redirect_to=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapWordpressEmail(url)).toBeUndefined()
  })
})
