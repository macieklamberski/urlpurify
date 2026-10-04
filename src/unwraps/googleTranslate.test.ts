import { describe, expect, it } from 'bun:test'
import { unwrapGoogleTranslate } from './googleTranslate.js'

describe('unwrapGoogleTranslate', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://translate.google.com/translate?u=https%3A%2F%2Fexample.com%2Fpage&sl=fr&tl=en',
    )

    expect(unwrapGoogleTranslate(url)).toBe('https://example.com/page')
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

  it('should return undefined for the translated frame on subdomains of translate.googleusercontent.com', () => {
    const url = new URL(
      'https://x.translate.googleusercontent.com/translate_c?u=https://example.com/page',
    )

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
})
