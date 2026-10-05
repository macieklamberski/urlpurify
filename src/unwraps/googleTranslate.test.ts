import { describe, expect, it } from 'bun:test'
import { unwrapGoogleTranslate } from './googleTranslate.js'

describe('unwrapGoogleTranslate', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://translate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://translate.google.com/translate?hl=fr&sl=en&u=http://www.example.com/berbie/Tutorials_1.5/Nike+iPod.Tutorial.html',
    )

    expect(unwrapGoogleTranslate(url)).toBe(
      'http://www.example.com/berbie/Tutorials_1.5/Nike+iPod.Tutorial.html',
    )
  })

  it('should read the first copy of u', () => {
    const url = new URL(
      'https://translate.google.com/translate?u=https://www.example.com/a+b&u=https://www.example.com/c',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://www.example.com/a+b')
  })

  it('should return undefined for non-redirect Translate URLs', () => {
    const url = new URL('https://translate.google.com/about')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://translate.google.com/translate?sl=fr&tl=en')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for non-Translate hosts', () => {
    const url = new URL('https://www.google.com/translate?u=https%3A%2F%2Fexample.com')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should extract target from translate.google.de host', () => {
    const url = new URL(
      'https://translate.google.de/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
  })

  it('should extract target from translate.google.co.uk host', () => {
    const url = new URL(
      'https://translate.google.co.uk/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
  })

  it('should extract target from www.translate.google.com host', () => {
    const url = new URL(
      'http://www.translate.google.com/translate?prev=hp&hl=hu&js=n&u=http%3A%2F%2Fexample.com%2Fpage&sl=hu&tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('http://example.com/page')
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL(
      'https://x.translate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for www glued to the translate host', () => {
    const url = new URL(
      'https://wwwtranslate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with translate.google.com', () => {
    const url = new URL(
      'https://translate.google.com.example.net/translate?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should extract target from the website path', () => {
    const url = new URL(
      'https://translate.google.com/website?sl=de&tl=en&hl=en-US&client=webapp&u=https://example.com/page',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
  })

  it('should return undefined for the translated frame path on translate.google.com', () => {
    const url = new URL(
      'https://translate.google.com/translate_c?u=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should extract target from the translated frame on translate.googleusercontent.com', () => {
    const url = new URL(
      'https://translate.googleusercontent.com/translate_c?depth=1&hl=en&prev=_t&rurl=translate.google.com&sl=auto&tl=en&u=https://example.com/page&usg=ALkJrhhisjTfKfIJmulggi8658qv7rQlpg',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
  })

  it('should return undefined for other paths on translate.googleusercontent.com', () => {
    const url = new URL('https://translate.googleusercontent.com/?u=https://example.com/page')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for the translated frame path on other hosts', () => {
    const url = new URL('https://example.com/translate_c?u=https://example.com/page')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for another subdomain of translate.google.com', () => {
    const url = new URL('https://x.translate.google.com/website?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for a repeated www label', () => {
    const url = new URL(
      'https://www.www.translate.google.com/translate?u=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should rebuild the target of a website proxy link', () => {
    const url = new URL(
      'https://news-example-com.translate.goog/1/932/932107.htm?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=es',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://news.example.com/1/932/932107.htm')
  })

  it('should keep the http scheme a website proxy link names', () => {
    const url = new URL(
      'https://web-archive-org.translate.goog/web/20090401041713/http://www.example.com/profile/president.html?_x_tr_sch=http&_x_tr_sl=ja&_x_tr_tl=en&_x_tr_hl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe(
      'http://web.archive.org/web/20090401041713/http://www.example.com/profile/president.html',
    )
  })

  it('should keep the query and fragment of a website proxy target', () => {
    const url = new URL(
      'https://www-example-org.translate.goog/php/example/ip_for_host.php?str=lms.pub%2Fgo.php&_x_tr_sl=ru&_x_tr_tl=en#result',
    )

    expect(unwrapGoogleTranslate(url)).toBe(
      'https://www.example.org/php/example/ip_for_host.php?str=lms.pub%2Fgo.php#result',
    )
  })

  it('should decode a doubled dash in a website proxy host', () => {
    const url = new URL('https://www-my--site-co-uk.translate.goog/post?_x_tr_sl=en&_x_tr_tl=de')

    expect(unwrapGoogleTranslate(url)).toBe('https://www.my-site.co.uk/post')
  })

  it('should return undefined for a hashed website proxy host', () => {
    const url = new URL(
      'https://gkg6hbawmh4aahgekdnsv2jrpm-ac4c6men2g7xr2a-example-com.translate.goog/2021/04/27/report/',
    )

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for a nested subdomain of translate.goog', () => {
    const url = new URL('https://www.example-com.translate.goog/post?_x_tr_sl=en')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with translate.goog', () => {
    const url = new URL('https://example-com.mytranslate.goog/post?_x_tr_sl=en')

    expect(unwrapGoogleTranslate(url)).toBeUndefined()
  })

  it('should prepend the host prefix a website proxy link carries', () => {
    const url = new URL(
      'https://xample-com.translate.goog/post?_x_tr_hp=www-e&_x_tr_sl=en&_x_tr_tl=de',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://www.example.com/post')
  })

  it('should decode an IDN website proxy host', () => {
    const url = new URL(
      'https://0-mnchen--3ya-example.translate.goog/?_x_tr_enc=0&_x_tr_sl=de&_x_tr_tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://xn--mnchen-3ya.example/')
  })

  it('should drop the 1- prefix an encoded website proxy host carries', () => {
    const url = new URL('https://1-www-example-com.translate.goog/post?_x_tr_enc=1&_x_tr_sl=en')

    expect(unwrapGoogleTranslate(url)).toBe('https://www.example.com/post')
  })
})
