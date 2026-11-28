import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapGoogleTranslate } from './googleTranslate.js'

describe('unwrapGoogleTranslate', () => {
  it('should extract target from u param', () => {
    const value = new URL(
      'https://translate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )
    const expected = 'https://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'http://translate.google.com/translate?hl=fr&sl=en&u=http://www.example.com/berbie/Tutorials_1.5/Nike+iPod.Tutorial.html',
    )
    const expected = 'http://www.example.com/berbie/Tutorials_1.5/Nike+iPod.Tutorial.html'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should read the first copy of u', () => {
    const value = new URL(
      'https://translate.google.com/translate?u=https://www.example.com/a+b&u=https://www.example.com/c',
    )
    const expected = 'https://www.example.com/a+b'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should return undefined for non-redirect Translate URLs', () => {
    const value = new URL('https://translate.google.com/about')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://translate.google.com/translate?sl=fr&tl=en')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for non-Translate hosts', () => {
    const value = new URL('https://www.google.com/translate?u=https%3A%2F%2Fexample.com')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should extract target from translate.google.de host', () => {
    const value = new URL(
      'https://translate.google.de/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )
    const expected = 'https://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should extract target from translate.google.co.uk host', () => {
    const value = new URL(
      'https://translate.google.co.uk/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )
    const expected = 'https://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should extract target from www.translate.google.com host', () => {
    const value = new URL(
      'http://www.translate.google.com/translate?prev=hp&hl=hu&js=n&u=http%3A%2F%2Fexample.com%2Fpage&sl=hu&tl=en',
    )
    const expected = 'http://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://x.translate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for www glued to the translate host', () => {
    const value = new URL(
      'https://wwwtranslate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with translate.google.com', () => {
    const value = new URL(
      'https://translate.google.com.example.net/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should extract target from the website path', () => {
    const value = new URL(
      'https://translate.google.com/website?sl=de&tl=en&hl=en-US&client=webapp&u=https://example.com/page',
    )
    const expected = 'https://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should return undefined for the translated frame path on translate.google.com', () => {
    const value = new URL(
      'https://translate.google.com/translate_c?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should extract target from the translated frame on translate.googleusercontent.com', () => {
    const value = new URL(
      'https://translate.googleusercontent.com/translate_c?depth=1&hl=en&prev=_t&rurl=translate.google.com&sl=auto&tl=en&u=https://example.com/page&usg=ALkJrhhisjTfKfIJmulggi8658qv7rQlpg',
    )
    const expected = 'https://example.com/page'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should return undefined for other paths on translate.googleusercontent.com', () => {
    const value = new URL('https://translate.googleusercontent.com/?u=https://example.com/page')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for the translated frame path on other hosts', () => {
    const value = new URL('https://example.com/translate_c?u=https://example.com/page')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for another subdomain of translate.google.com', () => {
    const value = new URL(
      'https://x.translate.google.com/website?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for a repeated www label', () => {
    const value = new URL(
      'https://www.www.translate.google.com/translate?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should rebuild the target of a website proxy link', () => {
    const value = new URL(
      'https://news-example-com.translate.goog/1/932/932107.htm?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=es',
    )
    const expected = 'https://news.example.com/1/932/932107.htm'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should keep the http scheme a website proxy link names', () => {
    const value = new URL(
      'https://web-archive-org.translate.goog/web/20090401041713/http://www.example.com/profile/president.html?_x_tr_sch=http&_x_tr_sl=ja&_x_tr_tl=en&_x_tr_hl=en',
    )
    const expected =
      'http://web.archive.org/web/20090401041713/http://www.example.com/profile/president.html'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should keep the query and fragment of a website proxy target', () => {
    const value = new URL(
      'https://www-example-org.translate.goog/php/example/ip_for_host.php?str=lms.pub%2Fgo.php&_x_tr_sl=ru&_x_tr_tl=en#result',
    )
    const expected =
      'https://www.example.org/php/example/ip_for_host.php?str=lms.pub%2Fgo.php#result'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should decode a doubled dash in a website proxy host', () => {
    const value = new URL('https://www-my--site-co-uk.translate.goog/post?_x_tr_sl=en&_x_tr_tl=de')
    const expected = 'https://www.my-site.co.uk/post'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should return undefined for a hashed website proxy host', () => {
    const value = new URL(
      'https://gkg6hbawmh4aahgekdnsv2jrpm-ac4c6men2g7xr2a-example-com.translate.goog/2021/04/27/report/',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for the translate page path on translate.googleusercontent.com', () => {
    const value = new URL(
      'https://translate.googleusercontent.com/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for the translate page path on a hashed website proxy host', () => {
    const value = new URL(
      'https://gkg6hbawmh4aahgekdnsv2jrpm-ac4c6men2g7xr2a-example-com.translate.goog/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for a nested subdomain of translate.goog', () => {
    const value = new URL('https://www.example-com.translate.goog/post?_x_tr_sl=en')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with translate.goog', () => {
    const value = new URL('https://example-com.mytranslate.goog/post?_x_tr_sl=en')

    expect(unwrapGoogleTranslate(value)).toBeUndefined()
  })

  it('should prepend the host prefix a website proxy link carries', () => {
    const value = new URL(
      'https://xample-com.translate.goog/post?_x_tr_hp=www-e&_x_tr_sl=en&_x_tr_tl=de',
    )
    const expected = 'https://www.example.com/post'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should read and drop a website proxy param named in uppercase', () => {
    const value = new URL(
      'https://xample-com.translate.goog/post?_X_TR_HP=www-e&_x_tr_sl=en&_x_tr_tl=de',
    )
    const expected = 'https://www.example.com/post'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should decode an IDN website proxy host', () => {
    const value = new URL(
      'https://0-mnchen--3ya-example.translate.goog/?_x_tr_enc=0&_x_tr_sl=de&_x_tr_tl=en',
    )
    const expected = 'https://xn--mnchen-3ya.example/'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should drop the 1- prefix an encoded website proxy host carries', () => {
    const value = new URL('https://1-www-example-com.translate.goog/post?_x_tr_enc=1&_x_tr_sl=en')
    const expected = 'https://www.example.com/post'

    expect(unwrapGoogleTranslate(value)).toBe(expected)
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapGoogleTranslate)).toBe(true)
  })
})
