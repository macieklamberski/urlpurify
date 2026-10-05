import { describe, expect, it } from 'bun:test'
import { unwrapUnisender } from './unisender.js'

describe('unwrapUnisender', () => {
  it('should extract a twice-encoded target', () => {
    const url = new URL(
      'http://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5uuxtmkosu775oodnd8ro&url=http%253A%252F%252Fexample.org%252Fevent%252F294092%252F%253Ft%253D52829',
    )

    expect(unwrapUnisender(url)).toBe('http://example.org/event/294092/?t=52829')
  })

  it('should extract a target encoded once', () => {
    const url = new URL(
      'https://geteml.com/ru/mail_link_tracker?hash=68kdgpowswrq7it1mheb7tmhpcrg1jn48en&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/')
  })

  it('should extract a base64url target with tilde padding', () => {
    const url = new URL(
      'https://geteml.com/ru/mail_link_tracker?hash=6m1gm36twcunqcdnb591sne3zu4aphuu78i55sp&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9rdXN0by8_dXRtX3NvdXJjZT1uZXdzbGV0dGVyMQ~~',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/kusto/?utm_source=newsletter1')
  })

  it('should extract a base64url target without padding', () => {
    const url = new URL(
      'https://trk.emlbest.com/ru/mail_link_tracker?hash=6m1gm36twcunqcdnb591sne3zu4aphuu78i55sp&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9rdXN0by8_dXRtX3NvdXJjZT1uZXdzbGV0dGVy',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/kusto/?utm_source=newsletter')
  })

  it('should extract the target from the go2 tracker path', () => {
    const url = new URL(
      'https://link.urait.ru/ru/go2_link_tracker?hash=6z9az4tzxhyjxzyz4emnf1y6bprt5g1wfif&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9uaWtlLXNiLz9xPTE~',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/nike-sb/?q=1')
  })

  it('should extract the target from the eu1 tracker path on a numbered host', () => {
    const url = new URL(
      'https://us7-usndr.com/ru/eu1_link_tracker?hash=6dh4q41ohybo4myz4emnf1y6bpgch5k6547m1c&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9uaWtlLXNiLz9xPTE~',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/nike-sb/?q=1')
  })

  it('should extract the target from the ua locale path', () => {
    const url = new URL(
      'https://link.emlmind.com/ua/mail_link_tracker?hash=6dh4q41ohybo4myz4emnf1y6bpgch5k6547m1c&url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(url)).toBe('https://example.org/')
  })

  it('should return undefined for a lookalike of the numbered host', () => {
    const url = new URL(
      'https://us7-usndr.com.example.net/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the numbered host', () => {
    const url = new URL(
      'https://xus7-usndr.com/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const url = new URL('https://usndr.com/ru/subscribe?url=https%253A%252F%252Fexample.org%252F')

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined for another locale prefix', () => {
    const url = new URL(
      'https://usndr.com/en/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined for a base64url non-http target', () => {
    const url = new URL('https://geteml.com/ru/mail_link_tracker?url=amF2YXNjcmlwdDphbGVydCgxKQ~~')

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5')

    expect(unwrapUnisender(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://usndr.com/ru/mail_link_tracker?url=')

    expect(unwrapUnisender(url)).toBeUndefined()
  })
})
