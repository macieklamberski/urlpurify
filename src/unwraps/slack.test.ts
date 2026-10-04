import { describe, expect, it } from 'bun:test'
import { unwrapSlack } from './slack.js'

describe('unwrapSlack', () => {
  it('should extract target from url param', () => {
    const url = new URL('https://slack-redir.net/link?url=https%3A%2F%2Fexample.com%2Farticle')

    expect(unwrapSlack(url)).toBe('https://example.com/article')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://slack-redir.net/link?other=value')

    expect(unwrapSlack(url)).toBeUndefined()
  })

  it('should return undefined for non-link Slack paths', () => {
    const url = new URL('https://slack-redir.net/redirect?url=https%3A%2F%2Fexample.com')

    expect(unwrapSlack(url)).toBeUndefined()
  })

  it('should return undefined for non-Slack hosts', () => {
    const url = new URL('https://example.com/link?url=https%3A%2F%2Fother.com')

    expect(unwrapSlack(url)).toBeUndefined()
  })

  it('should extract target on a subdomain no specimen shows', () => {
    const url = new URL('https://go.slack-redir.net/link?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapSlack(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://exampleslack-redir.net/link?url=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapSlack(url)).toBeUndefined()
  })
})
