import { describe, expect, it } from 'bun:test'
import { unwrapSlack } from './slack.js'

describe('unwrapSlack', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://slack-redir.net/link?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapSlack(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://slack-redir.net/link?other=value')

    expect(unwrapSlack(value)).toBeUndefined()
  })

  it('should return undefined for non-link Slack paths', () => {
    const value = new URL('https://slack-redir.net/redirect?url=https%3A%2F%2Fexample.com')

    expect(unwrapSlack(value)).toBeUndefined()
  })

  it('should return undefined for non-Slack hosts', () => {
    const value = new URL('https://example.com/link?url=https%3A%2F%2Fother.com')

    expect(unwrapSlack(value)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL('https://go.slack-redir.net/link?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapSlack(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://exampleslack-redir.net/link?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapSlack(value)).toBeUndefined()
  })
})
