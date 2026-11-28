import { describe, expect, it } from 'bun:test'
import { unwrapUrl } from '../clean.js'
import { unwrapUnisender } from './unisender.js'

describe('unwrapUnisender', () => {
  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'http://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5uuxtmkosu775oodnd8ro&url=http%253A%252F%252Fexample.org%252Fevent%252F294092%252F%253Ft%253D52829',
    )
    const expected = 'http://example.org/event/294092/?t=52829'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5uuxtmkosu775oodnd8ro&url=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract a target encoded once', () => {
    const value = new URL(
      'https://geteml.com/ru/mail_link_tracker?hash=68kdgpowswrq7it1mheb7tmhpcrg1jn48en&url=https%3A%2F%2Fexample.org%2F',
    )
    const expected = 'https://example.org/'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract a base64url target with tilde padding', () => {
    const value = new URL(
      'https://geteml.com/ru/mail_link_tracker?hash=6m1gm36twcunqcdnb591sne3zu4aphuu78i55sp&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9rdXN0by8_dXRtX3NvdXJjZT1uZXdzbGV0dGVyMQ~~',
    )
    const expected = 'https://example.org/kusto/?utm_source=newsletter1'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract a base64url target without padding', () => {
    const value = new URL(
      'https://trk.emlbest.com/ru/mail_link_tracker?hash=6m1gm36twcunqcdnb591sne3zu4aphuu78i55sp&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9rdXN0by8_dXRtX3NvdXJjZT1uZXdzbGV0dGVy',
    )
    const expected = 'https://example.org/kusto/?utm_source=newsletter'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract the target from the go2 tracker path', () => {
    const value = new URL(
      'https://link.urait.ru/ru/go2_link_tracker?hash=6z9az4tzxhyjxzyz4emnf1y6bprt5g1wfif&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9uaWtlLXNiLz9xPTE~',
    )
    const expected = 'https://example.org/nike-sb/?q=1'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract the last target when a tracker is nested unencoded', () => {
    const value = new URL(
      'https://geteml.com/ru/mail_link_tracker?hash=6i41hzp3emkus5t1mheb7tmhpcrg1jn48en&url=https://geteml.com/ru/mail_link_tracker?hash=68kdgpowswrq7it1mheb7tmhpcrg1jn48en&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9rdXN0by8_dXRtX3NvdXJjZT1uZXdzbGV0dGVyMQ~~',
    )
    const expected = 'https://example.org/kusto/?utm_source=newsletter1'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract the target from the eu1 tracker path on a numbered host', () => {
    const value = new URL(
      'https://us7-usndr.com/ru/eu1_link_tracker?hash=6dh4q41ohybo4myz4emnf1y6bpgch5k6547m1c&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9uaWtlLXNiLz9xPTE~',
    )
    const expected = 'https://example.org/nike-sb/?q=1'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract the target from a numbered host with www.', () => {
    const value = new URL(
      'https://www.us7-usndr.com/ru/eu1_link_tracker?hash=6dh4q41ohybo4myz4emnf1y6bpgch5k6547m1c&url=aHR0cHM6Ly9leGFtcGxlLm9yZy9uaWtlLXNiLz9xPTE~',
    )
    const expected = 'https://example.org/nike-sb/?q=1'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should extract the target from the ua locale path', () => {
    const value = new URL(
      'https://link.emlmind.com/ua/mail_link_tracker?hash=6dh4q41ohybo4myz4emnf1y6bpgch5k6547m1c&url=https%253A%252F%252Fexample.org%252F',
    )
    const expected = 'https://example.org/'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should return undefined for a lookalike of the numbered host', () => {
    const value = new URL(
      'https://us7-usndr.com.example.net/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the numbered host', () => {
    const value = new URL(
      'https://xus7-usndr.com/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for another subdomain of a numbered host', () => {
    const value = new URL(
      'https://click.us7-usndr.com/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for a non-numbered host', () => {
    const value = new URL(
      'https://usx-usndr.com/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for another path on the same host', () => {
    const value = new URL('https://usndr.com/ru/subscribe?url=https%253A%252F%252Fexample.org%252F')

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for another tracker name', () => {
    const value = new URL(
      'https://usndr.com/ru/open_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for the tracker path under a prefix', () => {
    const value = new URL(
      'https://usndr.com/x/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for the tracker path with a trailing segment', () => {
    const value = new URL(
      'https://usndr.com/ru/mail_link_tracker/x?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined for another locale prefix', () => {
    const value = new URL(
      'https://usndr.com/en/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should leave a base64url non-http target unwrapped', () => {
    const value = 'https://geteml.com/ru/mail_link_tracker?url=amF2YXNjcmlwdDphbGVydCgxKQ~~'

    expect(unwrapUrl(value, [unwrapUnisender])).toBeUndefined()
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://usndr.com/ru/mail_link_tracker?url=https%253A%252F%252Fexample.org%252F100%25',
    )
    const expected = 'https://example.org/100%'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5')

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://usndr.com/ru/mail_link_tracker?url=')

    expect(unwrapUnisender(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5uuxtmkosu775oodnd8ro&url=http%253A%252F%252Fexample.org%252Fevent%252F294092%252F%253Ft%253D52829%23top',
    )
    const expected = 'http://example.org/event/294092/?t=52829#top'

    expect(unwrapUnisender(value)).toBe(expected)
  })

  it('should return undefined for a relative value', () => {
    const value = new URL(
      'http://usndr.com/ru/mail_link_tracker?hash=5ophjexcycqe5wnr3ykwqf6hro5uuxtmkosu775oodnd8ro&url=/local/page',
    )

    expect(unwrapUnisender(value)).toBeUndefined()
  })
})
