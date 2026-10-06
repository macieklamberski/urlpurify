import { describe, expect, it } from 'bun:test'
import { unwrapMailRuLink } from './mailRuLink.js'

describe('unwrapMailRuLink', () => {
  it('should extract the target from a link shim url', () => {
    const url = new URL(
      'http://e.mail.ru/cgi-bin/link?check=1&refresh=1&cnf=3dbce9&url=http%3A%2F%2Fwww.example.com%2Frelease%2Fskypark%2F1167982&msgid=13815168390000000486;0,1&x-email=user%40example.com',
    )

    expect(unwrapMailRuLink(url)).toBe('http://www.example.com/release/skypark/1167982')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://e.mail.ru/cgi-bin/link?check=1&refresh=1&cnf=e00806&url=http://example.com/ru/&msgid=14753461900000000064;0;1',
    )

    expect(unwrapMailRuLink(url)).toBe('http://example.com/ru/')
  })

  it('should return undefined when the url param is missing', () => {
    const url = new URL('https://e.mail.ru/cgi-bin/link?check=1&cnf=e00806')

    expect(unwrapMailRuLink(url)).toBeUndefined()
  })

  it('should return undefined for another path on e.mail.ru', () => {
    const url = new URL('https://e.mail.ru/login?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapMailRuLink(url)).toBeUndefined()
  })

  it('should return undefined for the link path on another host', () => {
    const url = new URL('https://example.com/cgi-bin/link?check=1&url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapMailRuLink(url)).toBeUndefined()
  })
})
