import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapMimecast } from './mimecast.js'

describe('unwrapMimecast', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Farticle&token=xyz',
    )
    const expected = 'https://example.com/article'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/s/abc123?url=https%253A%252F%252Fexample.org%252Fpage&token=xyz',
    )
    const expected = 'https://example.org/page'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/s/abc123?url=https://example.org/search/a+b&token=xyz',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should return undefined for the domain param, which holds only the host', () => {
    const value = new URL('https://protect-us.mimecast.com/s/abc123?domain=example.com')

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should match other regional Mimecast subdomains', () => {
    const value = new URL(
      'https://protect-eu.mimecast.com/s/xyz789?url=https%3A%2F%2Fexample.com%2Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should prefer url param over domain when both are present', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/s/abc?url=https%3A%2F%2Fexample.com%2Farticle&domain=other.com',
    )
    const expected = 'https://example.com/article'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should return undefined when both url and domain are missing', () => {
    const value = new URL('https://protect-us.mimecast.com/s/abc123?token=xyz')

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for non-Mimecast hosts', () => {
    const value = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should extract target on the Australian region', () => {
    const value = new URL(
      'https://protect-au.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should extract target on the three-letter usb region', () => {
    const value = new URL(
      'https://protect-usb.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should extract target on a region no specimen shows', () => {
    const value = new URL(
      'https://protect-za.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should extract target from url param on a mimecastprotect.com host', () => {
    const value = new URL(
      'https://url.us.m.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?url=https%3A%2F%2Fexample.org%2Fpost',
    )
    const expected = 'https://example.org/post'

    expect(unwrapMimecast(value)).toBe(expected)
  })

  it('should return undefined for the domain param on a mimecastprotect.com host', () => {
    const value = new URL(
      'https://url.us.m.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?domain=example.org/',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a mimecastprotect.com lookalike domain', () => {
    const value = new URL(
      'https://url.us.m.examplemimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a host that ends with a mimecastprotect.com region host', () => {
    const value = new URL(
      'https://myurl.us.m.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a mimecastprotect.com region host', () => {
    const value = new URL(
      'https://url.us.m.mimecastprotect.com.example.net/s/E1dLCDkD3Rto6WnuAizSjIfXT?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a mimecastprotect.com host with another product label', () => {
    const value = new URL(
      'https://url.us.x.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a Mimecast host that is not a protect region', () => {
    const value = new URL(
      'https://login.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a protect host with a longer region name', () => {
    const value = new URL(
      'https://protect-usab.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a protect host with a shorter region name', () => {
    const value = new URL(
      'https://protect-u.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for the bare Mimecast domain', () => {
    const value = new URL('https://mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a host that ends with a protect region name', () => {
    const value = new URL(
      'https://notprotect-us.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a protect region', () => {
    const value = new URL(
      'https://protect-us.mimecast.com.example.net/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const value = new URL(
      'https://protect-us.examplemimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/other/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should return undefined for a deeper path', () => {
    const value = new URL(
      'https://protect-us.mimecast.com/s/abc123/extra?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapMimecast)).toBe(true)
  })
})
