import { describe, expect, it } from 'bun:test'
import { unwrapMimecast } from './mimecast.js'

describe('unwrapMimecast', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://protect-us.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Farticle&token=xyz',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/article')
  })

  it('should synthesise https URL from domain param', () => {
    const url = new URL('https://protect-us.mimecast.com/s/abc123?domain=example.com')

    expect(unwrapMimecast(url)).toBe('https://example.com')
  })

  it('should match other regional Mimecast subdomains', () => {
    const url = new URL(
      'https://protect-eu.mimecast.com/s/xyz789?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/page')
  })

  it('should prefer url param over domain when both are present', () => {
    const url = new URL(
      'https://protect-us.mimecast.com/s/abc?url=https%3A%2F%2Fexample.com%2Farticle&domain=other.com',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/article')
  })

  it('should return undefined when both url and domain are missing', () => {
    const url = new URL('https://protect-us.mimecast.com/s/abc123?token=xyz')

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for non-Mimecast hosts', () => {
    const url = new URL('https://example.com/?url=https%3A%2F%2Fother.com')

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should extract target on the Australian region', () => {
    const url = new URL(
      'https://protect-au.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/post')
  })

  it('should extract target on the three-letter usb region', () => {
    const url = new URL(
      'https://protect-usb.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/post')
  })

  it('should extract target on a region no specimen shows', () => {
    const url = new URL(
      'https://protect-za.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBe('https://example.com/post')
  })

  it('should synthesise https URL from domain param on a mimecastprotect.com host', () => {
    const url = new URL(
      'https://url.us.m.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?domain=example.org/',
    )

    expect(unwrapMimecast(url)).toBe('https://example.org/')
  })

  it('should return undefined for a mimecastprotect.com lookalike domain', () => {
    const url = new URL(
      'https://url.us.m.examplemimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?domain=example.org/',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a host that ends with a mimecastprotect.com region host', () => {
    const url = new URL(
      'https://myurl.us.m.mimecastprotect.com/s/E1dLCDkD3Rto6WnuAizSjIfXT?domain=example.org/',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a mimecastprotect.com region host', () => {
    const url = new URL(
      'https://url.us.m.mimecastprotect.com.example.net/s/E1dLCDkD3Rto6WnuAizSjIfXT?domain=example.org/',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a Mimecast host that is not a protect region', () => {
    const url = new URL('https://login.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a protect host with a longer region name', () => {
    const url = new URL(
      'https://protect-usab.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a protect host with a shorter region name', () => {
    const url = new URL(
      'https://protect-u.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for the bare Mimecast domain', () => {
    const url = new URL('https://mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a host that ends with a protect region name', () => {
    const url = new URL(
      'https://notprotect-us.mimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a protect region', () => {
    const url = new URL(
      'https://protect-us.mimecast.com.example.net/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike domain', () => {
    const url = new URL(
      'https://protect-us.examplemimecast.com/s/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://protect-us.mimecast.com/other/abc123?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })

  it('should return undefined for a deeper path', () => {
    const url = new URL(
      'https://protect-us.mimecast.com/s/abc123/extra?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapMimecast(url)).toBeUndefined()
  })
})
