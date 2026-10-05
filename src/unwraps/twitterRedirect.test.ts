import { describe, expect, it } from 'bun:test'
import { unwrapTwitterRedirect } from './twitterRedirect.js'

describe('unwrapTwitterRedirect', () => {
  it('should extract the target from the email click redirect', () => {
    const url = new URL(
      'https://t.co/redirect?url=http%3A%2F%2Fwww.example.com%2Fpost&sig=1d589f8ef82f3c6ad952699efc78977ac7178995&uid=331593067&iid=c0896f3fae864ae8a5365d2d13121845',
    )

    expect(unwrapTwitterRedirect(url)).toBe('http://www.example.com/post')
  })

  it('should return undefined for the redirect without url', () => {
    const url = new URL('https://t.co/redirect?sig=1d589f8ef82f3c6ad952699efc78977ac7178995')

    expect(unwrapTwitterRedirect(url)).toBeUndefined()
  })

  it('should return undefined for a short link', () => {
    const url = new URL('https://t.co/6eJtSD9zlA?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTwitterRedirect(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/redirect?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTwitterRedirect(url)).toBeUndefined()
  })
})
