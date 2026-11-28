import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapperHosts } from '../utils.js'
import { unwrapDerefMail } from './derefMail.js'

const unclaimedLightmailerPaths: Array<string> = [
  '/deref/',
  '/WJID20DIzrg/deref/below/',
  '/mail/WJID20DIzrg/deref/',
]

describe('unwrapDerefMail', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=www.example.com%2Fpost'
    const expected = 'https://www.example.com/post'

    expect(purifyUrl(value, { unwrappers: [unwrapDerefMail] })).toBe(expected)
  })

  it('should extract target from redirectUrl param', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com',
    )
    const expected = 'http://www.example.com'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target when the path carries a session token', () => {
    const value = new URL(
      'https://deref-web.de/mail/client/BnWC_HUE7ow/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2Fkontakt',
    )
    const expected = 'https://example.com/kontakt'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should keep the query of the target when an lm flag follows', () => {
    const value = new URL(
      'https://deref-web.de/mail/client/Sc6sdE0hrPg/dereferrer/?redirectUrl=http%3A%2F%2Fwww.example.com%2Fmitgliedschaft%3Fem_src%3Dcoop%26em_cmp%3Dfanzone&lm',
    )
    const expected = 'http://www.example.com/mitgliedschaft?em_src=coop&em_cmp=fanzone'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/ip3yU-LvC_A/dereferrer/?redirectUrl=https%253A%252F%252Fexample.com%252Fc%252FarFxIdjGg%252F',
    )
    const expected = 'https://example.com/c/arFxIdjGg/'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should keep a stray percent sign in a twice-encoded target', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https%253A%252F%252Fexample.com%252F100%25',
    )
    const expected = 'https://example.com/100%'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https://www.example.com/Bienenkiller',
    )
    const expected = 'https://www.example.com/Bienenkiller'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target on 3c.gmx.net without the trailing slash', () => {
    const value = new URL(
      'https://3c.gmx.net/mail/client/dereferrer?redirectUrl=http%3A%2F%2Fwww.example.com%2FMartin-Wehrle%2Fe%2FB0043BX5TU',
    )
    const expected = 'http://www.example.com/Martin-Wehrle/e/B0043BX5TU'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target from the DEST param of the older dereferrer', () => {
    const value = new URL(
      'https://service.gmx.net/de/cgi/derefer?TYPE=3&DEST=http%3A%2F%2Fwww.example.com%2Fmarken%2Fbench%2F',
    )
    const expected = 'http://www.example.com/marken/bench/'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target on the light mailer path with a session token', () => {
    const value = new URL(
      'https://lightmailer.mail.com/WJID20DIzrg/deref/?redirectUrl=https%3A%2F%2Fwww.example.com%2Fcartoon%3FsearchID%3DCS448172',
    )
    const expected = 'https://www.example.com/cartoon?searchID=CS448172'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it.each(unclaimedLightmailerPaths)('should return undefined for light mailer path %s', (path) => {
    const value = new URL(
      `https://lightmailer.mail.com${path}?redirectUrl=https%3A%2F%2Fwww.example.com%2F`,
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for another path on service.mail.com', () => {
    const value = new URL('https://service.mail.com/?target=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for another path on a FreeMail host', () => {
    const value = new URL('https://freemailng2504.web.de/?goto=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should extract target from the target param of the leaving page', () => {
    const value = new URL(
      'https://service.mail.com/dereferrer/?target=http%3A%2F%2Fwww.example.com%2Fpcasts%2Fep1.mp3&lang=en',
    )
    const expected = 'http://www.example.com/pcasts/ep1.mp3'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target from the leaving page on the bare gmx.com', () => {
    const value = new URL('https://gmx.com/dereferrer/?target=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target from the United Internet leaving page on the bare host', () => {
    const value = new URL('https://ui-deref.de/r/?to=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should extract target from the to param of the United Internet leaving page', () => {
    const value = new URL(
      'https://www.ui-deref.de/r/?to=https://www.example.com/watch%3Fv%3DVOFoSa1pMnA&tt1=iu17T-7t7XEMafXlAQd5Ku',
    )
    const expected = 'https://www.example.com/watch?v=VOFoSa1pMnA'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should return undefined for another path on www.ui-deref.de', () => {
    const value = new URL('https://www.ui-deref.de/?to=https://www.example.com/')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should extract target from the goto param of the FreeMail jump', () => {
    const value = new URL(
      'https://freemailng2504.web.de/jump.htm?goto=http%3A%2F%2Fwww.example.com%2Fwatch%3Fv%3DZlXhb9SAap0',
    )
    const expected = 'http://www.example.com/watch?v=ZlXhb9SAap0'

    expect(unwrapDerefMail(value)).toBe(expected)
  })

  it('should return undefined for the FreeMail jump on a host without a number', () => {
    const value = new URL('https://freemailng.web.de/jump.htm?goto=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for the FreeMail jump on a host that only starts with it', () => {
    const value = new URL(
      'https://freemailng2504.web.de.example.com/jump.htm?goto=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for the FreeMail jump on a host that only ends with it', () => {
    const value = new URL(
      'https://xfreemailng2504.web.de/jump.htm?goto=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined when DEST param is missing', () => {
    const value = new URL('https://service.gmx.net/de/cgi/derefer?TYPE=3')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for another path on service.gmx.net', () => {
    const value = new URL(
      'https://service.gmx.net/de/cgi/other?DEST=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for a 3c.gmx.net path below dereferrer', () => {
    const value = new URL(
      'https://3c.gmx.net/mail/client/dereferrer/x?redirectUrl=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined when redirectUrl param is missing', () => {
    const value = new URL('https://deref-gmx.net/mail/client/dereferrer/')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined when redirectUrl param is empty', () => {
    const value = new URL('https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=javascript%3Aalert(1)'

    expect(purifyUrl(value, { unwrappers: [unwrapDerefMail] })).toBe(value)
  })

  it('should keep the wrapper for a malformed twice-encoded target', () => {
    const value =
      'https://deref-gmx.net/mail/client/dereferrer/?redirectUrl=https%253A%25E0%25A4%25A'

    expect(purifyUrl(value, { unwrappers: [unwrapDerefMail] })).toBe(value)
  })

  it('should return undefined for other paths on a dereferrer domain', () => {
    const value = new URL('https://deref-mail.com/mail/?redirectUrl=https%3A%2F%2Fexample.com%2F')

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for a path that only ends in dereferrer', () => {
    const value = new URL(
      'https://deref-gmx.net/other/mail/client/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for a path with two segments before dereferrer', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/abc/def/dereferrer/?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for a path below dereferrer', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer/help?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should return undefined for the path without the trailing slash', () => {
    const value = new URL(
      'https://deref-gmx.net/mail/client/dereferrer?redirectUrl=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapDerefMail(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapDerefMail)).toBe(true)
  })
})
