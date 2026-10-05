import { describe, expect, it } from 'bun:test'
import { unwrapWebArchive } from './webArchive.js'

const modifierUrls = [
  'https://web.archive.org/web/20240101120000id_/https://example.com/page',
  'https://web.archive.org/web/20240101120000if_/https://example.com/page',
  'https://web.archive.org/web/20240101120000mp_/https://example.com/page',
  'https://web.archive.org/web/20240101120000fw_/https://example.com/page',
  'https://web.archive.org/web/20240101120000oe_/https://example.com/page',
  'https://web.archive.org/web/20240101120000im_/https://example.com/page',
  'https://web.archive.org/web/20240101120000js_/https://example.com/page',
  'https://web.archive.org/web/20240101120000cs_/https://example.com/page',
]

const hostUrls = [
  'https://replay.web.archive.org/20240101120000/https://example.com/page',
  'https://web.archive.org/20240101120000/https://example.com/page',
]

const archiveItUrls = [
  'https://wayback.archive-it.org/23504/20240101120000/https://example.com/page',
  'https://wayback.archive-it.org/org-1234/20240101120000/https://example.com/page',
  'https://wayback.archive-it.org/all/20240101120000/https://example.com/page',
  'https://wayback.archive-it.org/23504/20240101120000mp_/https://example.com/page',
]

const prefixedUrls = [
  'https://web.archive.org/x/web/20240101120000/https://example.com/page',
  'https://replay.web.archive.org/x/20240101120000/https://example.com/page',
  'https://wayback.archive-it.org/x/23504/20240101120000/https://example.com/page',
]

describe('unwrapWebArchive', () => {
  it('should extract original URL from snapshot path', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000/https%3A%2F%2Fexample.com%2Farticle',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/article')
  })

  it('should keep the query string and fragment of an unencoded target', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000/https://example.com/a?id=5#section',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/a?id=5#section')
  })

  it('should accept the wildcard suffix on the timestamp', () => {
    const url = new URL(
      'https://web.archive.org/web/20240101120000*/https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapWebArchive(url)).toBe('https://example.com/page')
  })

  it('should return undefined when timestamp has wrong digit count', () => {
    const url = new URL('https://web.archive.org/web/2024/https%3A%2F%2Fexample.com')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for non-archive.org hosts', () => {
    const url = new URL('https://example.com/web/20240101120000/https%3A%2F%2Fother.com')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined when encoded URL has malformed percent escapes', () => {
    const url = new URL('https://web.archive.org/web/20240101120000/bad%ZZ')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it.each(modifierUrls)('should extract the target from %s', (value) => {
    expect(unwrapWebArchive(new URL(value))).toBe('https://example.com/page')
  })

  it.each(hostUrls)('should extract the target from %s', (value) => {
    expect(unwrapWebArchive(new URL(value))).toBe('https://example.com/page')
  })

  it.each(archiveItUrls)('should extract the target from %s', (value) => {
    expect(unwrapWebArchive(new URL(value))).toBe('https://example.com/page')
  })

  it('should extract the target from a latest snapshot path without a timestamp', () => {
    const value = new URL('https://web.archive.org/web/https://example.com/page')

    expect(unwrapWebArchive(value)).toBe('https://example.com/page')
  })

  it('should return undefined for a partial timestamp before an unencoded target', () => {
    const value = new URL('https://web.archive.org/web/2024/https://example.com/page')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should keep the query string and fragment of an Archive-It target', () => {
    const value = new URL(
      'https://wayback.archive-it.org/23504/20240101120000/https://example.com/a?id=5#section',
    )

    expect(unwrapWebArchive(value)).toBe('https://example.com/a?id=5#section')
  })

  it('should return undefined for the calendar wildcard', () => {
    const value = new URL('https://web.archive.org/web/*/https://example.com/page')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp with a modifier', () => {
    const value = new URL('https://web.archive.org/web/20240101id_/https://example.com/page')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for an Archive-It collection page', () => {
    const value = new URL('https://wayback.archive-it.org/23504/')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for the Archive-It path shape on another host', () => {
    const value = new URL('https://web.archive.org/23504/20240101120000/https://example.com/page')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL('https://web.archive.org/web/20240101120000/ftp://example.com/file')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it.each(prefixedUrls)(
    'should return undefined for a snapshot path under another prefix: %s',
    (value) => {
      expect(unwrapWebArchive(new URL(value))).toBeUndefined()
    },
  )

  it('should extract the target of a Scholar access link', () => {
    const url = new URL(
      'https://scholar.archive.org/work/pzg73yuesjdrlprgamoxvwkeum/access/wayback/https://www.example.com/load_pdf.php?ID_ARTICLE=TRAV_024_0021&download=1',
    )

    expect(unwrapWebArchive(url)).toBe(
      'https://www.example.com/load_pdf.php?ID_ARTICLE=TRAV_024_0021&download=1',
    )
  })

  it('should extract a percent-encoded target of a Scholar access link', () => {
    const url = new URL(
      'https://scholar.archive.org/work/3vyjt2wj2ndp5egy72xkudeeey/access/wayback/https%3A%2F%2Fwww.example.com%2Fdownload%2F4cc417',
    )

    expect(unwrapWebArchive(url)).toBe('https://www.example.com/download/4cc417')
  })

  it('should return undefined for the Scholar work page', () => {
    const url = new URL('https://scholar.archive.org/work/pzg73yuesjdrlprgamoxvwkeum')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for the Scholar access path on another host', () => {
    const url = new URL(
      'https://web.archive.org/work/pzg73yuesjdrlprgamoxvwkeum/access/wayback/https://www.example.com/a.pdf',
    )

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for the save path', () => {
    const url = new URL('https://web.archive.org/save/https://example.com/page')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })
})
