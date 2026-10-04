import { describe, expect, it } from 'bun:test'
import { unwrapMailchimp } from './mailchimp.js'

describe('unwrapMailchimp', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://list.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Farticle&xid=abc&uid=12345',
    )

    expect(unwrapMailchimp(url)).toBe('https://example.com/article')
  })

  it('should extract target from url param on the singular click path', () => {
    const url = new URL(
      'https://us5.mailchimp.com/mctx/click?url=http%3A%2F%2Fexample.com%2Fp%2Fdroles-doiseaux.html&xid=7d119d894a&uid=11704579&pool=&subject=',
    )

    expect(unwrapMailchimp(url)).toBe('http://example.com/p/droles-doiseaux.html')
  })

  it('should return undefined for url param below the click path', () => {
    const url = new URL('https://us5.mailchimp.com/mctx/click/extra?url=https%3A%2F%2Fexample.com')

    expect(unwrapMailchimp(url)).toBeUndefined()
  })

  it('should match other Mailchimp subdomains', () => {
    const url = new URL(
      'https://eepurl.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(url)).toBe('https://example.com/other')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://list.mailchimp.com/mctx/clicks?xid=abc')

    expect(unwrapMailchimp(url)).toBeUndefined()
  })

  it('should return undefined for non-clicks paths', () => {
    const url = new URL('https://list.mailchimp.com/clicks?url=https%3A%2F%2Fexample.com')

    expect(unwrapMailchimp(url)).toBeUndefined()
  })

  it('should return undefined for non-Mailchimp hosts', () => {
    const url = new URL('https://example.com/mctx/clicks?url=https%3A%2F%2Fother.com')

    expect(unwrapMailchimp(url)).toBeUndefined()
  })

  it('should return undefined for url param on a nested click path', () => {
    const url = new URL('https://us5.mailchimp.com/x/mctx/click?url=https%3A%2F%2Fexample.com')

    expect(unwrapMailchimp(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL(
      'https://examplemailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMailchimp(url)).toBeUndefined()
  })
})
