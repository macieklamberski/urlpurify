import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapMailchimp } from './mailchimp.js'

describe('unwrapMailchimp', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://us14.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Farticle&xid=abc&uid=12345',
    )
    const expected = 'https://example.com/article'

    expect(unwrapMailchimp(value)).toBe(expected)
  })

  it('should extract target from url param on the singular click path', () => {
    const value = new URL(
      'https://us5.mailchimp.com/mctx/click?url=http%3A%2F%2Fexample.com%2Fp%2Fdroles-doiseaux.html&xid=7d119d894a&uid=11704579&pool=&subject=',
    )
    const expected = 'http://example.com/p/droles-doiseaux.html'

    expect(unwrapMailchimp(value)).toBe(expected)
  })

  it('should return undefined for url param below the click path', () => {
    const value = new URL(
      'https://us5.mailchimp.com/mctx/click/extra?url=https%3A%2F%2Fexample.com',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for an unnumbered subdomain', () => {
    const value = new URL(
      'https://eepurl.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should match every numbered data-center host', () => {
    const value = new URL(
      'https://us22.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )
    const expected = 'https://example.com/other'

    expect(unwrapMailchimp(value)).toBe(expected)
  })

  it('should return undefined for the admin host of a data center', () => {
    const value = new URL(
      'https://us2.admin.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for a data center host with no number', () => {
    const value = new URL(
      'https://us.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for a host that ends with a data center name', () => {
    const value = new URL(
      'https://notus5.mailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a data center', () => {
    const value = new URL(
      'https://us5.mailchimp.com.example.net/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fother',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://us14.mailchimp.com/mctx/clicks?xid=abc')

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for non-clicks paths', () => {
    const value = new URL('https://us14.mailchimp.com/clicks?url=https%3A%2F%2Fexample.com')

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for non-Mailchimp hosts', () => {
    const value = new URL('https://example.com/mctx/clicks?url=https%3A%2F%2Fother.com')

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for url param on a nested click path', () => {
    const value = new URL('https://us5.mailchimp.com/x/mctx/click?url=https%3A%2F%2Fexample.com')

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL(
      'https://examplemailchimp.com/mctx/clicks?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMailchimp(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapMailchimp)).toBe(true)
  })
})
