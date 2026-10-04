import { describe, expect, it } from 'bun:test'
import { unwrapDerefMail } from './derefMail.js'

const dereferrerDomains: Array<string> = [
  'deref-1und1.de',
  'deref-1und1-02.de',
  'deref-gmx.co.uk',
  'deref-gmx.com',
  'deref-gmx.fr',
  'deref-gmx.net',
  'deref-mail.com',
  'deref-mail-02.com',
  'deref-web.de',
  'deref-web-02.de',
]

describe('unwrapDerefMail', () => {
  it('should extract target from redirectUrl param', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapDerefMail(url)).toBe('http://www.example.com')
  })

  it('should extract target when the path carries a session token', () => {
    const url = new URL(
      'https://deref-web.de/mail/client/BnWC_HUE7ow/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2Fkontakt',
    )

    expect(unwrapDerefMail(url)).toBe('https://example.com/kontakt')
  })

  it('should keep the query of the target when an lm flag follows', () => {
    const url = new URL(
      'https://deref-web.de/mail/client/Sc6sdE0hrPg/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com%2Fmitgliedschaft%3Fem_src%3Dcoop%26em_cmp%3Dfanzone&lm',
    )

    expect(unwrapDerefMail(url)).toBe(
      'http://www.example.com/mitgliedschaft?em_src=coop&em_cmp=fanzone',
    )
  })

  it('should extract target on deref-mail.com', () => {
    const url = new URL(
      'https://deref-mail.com/mail/client/q8XRYc3V_nM/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapDerefMail(url)).toBe('http://www.example.com')
  })

  it('should extract target on a numbered dereferrer domain', () => {
    const url = new URL(
      'https://deref-web-02.de/mail/client/v_uK5ltxjWc/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.org',
    )

    expect(unwrapDerefMail(url)).toBe('http://www.example.org')
  })

  it.each(dereferrerDomains)('should extract target on %s', (domain) => {
    const url = new URL(
      `https://${domain}/mail/client/q8XRYc3V_nM/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com`,
    )

    expect(unwrapDerefMail(url)).toBe('http://www.example.com')
  })

  it('should extract target on a subdomain of a dereferrer domain', () => {
    const url = new URL(
      'https://www.deref-gmx.net/mail/client/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBe('https://example.com/')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/ip3yU-LvC_A/dereferrer/?redirectUrl=https%253A%252F%252Fexample.com%252Fc%252FarFxIdjGg%252F',
    )

    expect(unwrapDerefMail(url)).toBe('https://example.com/c/arFxIdjGg/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https://www.example.com/Bienenkiller',
    )

    expect(unwrapDerefMail(url)).toBe('https://www.example.com/Bienenkiller')
  })

  it('should return undefined when redirectUrl param is missing', () => {
    const url = new URL('https://deref-gmx.net/mail/client/dereferrer/')

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined when redirectUrl param is empty', () => {
    const url = new URL('https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=')

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=javascript%3Aalert(1)',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a malformed twice-encoded target', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https%253A%25E0%25A4%25A',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for other paths on a dereferrer domain', () => {
    const url = new URL('https://deref-mail.com/mail/?redirectUrl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a path that only ends in dereferrer', () => {
    const url = new URL(
      'https://deref-gmx.net/other/mail/client/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a path with two segments before dereferrer', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/abc/def/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a path below dereferrer', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/help?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const url = new URL(
      'https://deref-gmx.net/mail/client/dereferrer?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://notderef-gmx.net/mail/client/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })

  it('should return undefined for a host that only contains a dereferrer domain', () => {
    const url = new URL(
      'https://deref-gmx.net.example.com/mail/client/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(url)).toBeUndefined()
  })
})
