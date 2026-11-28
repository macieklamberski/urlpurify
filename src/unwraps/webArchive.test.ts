import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
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
  it('should repair a target the CMS spaced after its scheme', () => {
    const value =
      'https://web.archive.org/web/20200101000000/http://%20https://www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(expected)
  })

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

  it('should keep the wrapper when timestamp has wrong digit count', () => {
    const url = 'https://web.archive.org/web/2024/https%3A%2F%2Fexample.com'

    expect(purifyUrl(url, { unwrappers: [unwrapWebArchive] })).toBe(url)
  })

  it('should return undefined for non-archive.org hosts', () => {
    const url = new URL('https://example.com/web/20240101120000/https%3A%2F%2Fother.com')

    expect(unwrapWebArchive(url)).toBeUndefined()
  })

  it('should keep the wrapper when encoded URL has malformed percent escapes', () => {
    const url = 'https://web.archive.org/web/20240101120000/bad%ZZ'

    expect(purifyUrl(url, { unwrappers: [unwrapWebArchive] })).toBe(url)
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

  it('should add the http scheme to a latest snapshot target stored without one', () => {
    const value = new URL('https://web.archive.org/web/www.example.com/article/865611356/')

    expect(unwrapWebArchive(value)).toBe('http://www.example.com/article/865611356/')
  })

  it('should add the http scheme to a snapshot target stored without one', () => {
    const value = new URL(
      'https://web.archive.org/web/20160930144425/www.example.com/temp/chess.pov',
    )

    expect(unwrapWebArchive(value)).toBe('http://www.example.com/temp/chess.pov')
  })

  it('should add the http scheme to a replay target stored without one', () => {
    const value = new URL(
      'https://web.archive.org/20021217021438/www.example.com/arabic/history/history_uae.asp',
    )

    expect(unwrapWebArchive(value)).toBe('http://www.example.com/arabic/history/history_uae.asp')
  })

  it('should keep the wrapper for a Wayback path with no dot in its first segment', () => {
    const value = 'https://web.archive.org/web/sitemap/example.com/'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the wrapper for the Wayback search form', () => {
    const value =
      'https://web.archive.org/web/form-submit.jsp?type=prefixquery&url=http://example.com/'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the wrapper for the old Wayback home page', () => {
    const value = 'https://archive.org/web/web.php'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the wrapper for a relative image snapshot', () => {
    const value = 'https://web.archive.org/web/20070220192932im_/dk46.jpg'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should add the http scheme to a host with a php label', () => {
    const value = new URL('https://web.archive.org/web/20160930144425/www.php.net/manual/')

    expect(unwrapWebArchive(value)).toBe('http://www.php.net/manual/')
  })

  it('should keep the wrapper for a mailto target', () => {
    const value = 'https://web.archive.org/web/20240101120000/mailto:info@example.com'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the wrapper for a partial timestamp before an unencoded target', () => {
    const value = 'https://web.archive.org/web/2024/https://example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the query string and fragment of an Archive-It target', () => {
    const value = new URL(
      'https://wayback.archive-it.org/23504/20240101120000/https://example.com/a?id=5#section',
    )

    expect(unwrapWebArchive(value)).toBe('https://example.com/a?id=5#section')
  })

  it('should keep the wrapper for the calendar wildcard', () => {
    const value = 'https://web.archive.org/web/*/https://example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should keep the wrapper for a partial timestamp with a modifier', () => {
    const value = 'https://web.archive.org/web/20240101id_/https://example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
  })

  it('should return undefined for an Archive-It collection page', () => {
    const value = new URL('https://wayback.archive-it.org/23504/')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for the Archive-It path shape on another host', () => {
    const value = new URL('https://web.archive.org/23504/20240101120000/https://example.com/page')

    expect(unwrapWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://web.archive.org/web/20240101120000/ftp://example.com/file'

    expect(purifyUrl(value, { unwrappers: [unwrapWebArchive] })).toBe(value)
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

  it('should keep the query of a target with its colon alone encoded', () => {
    const value = new URL(
      'https://web.archive.org/web/20111107072614/https%3A//www.example.com/cgi-bin/article.cgi?f=/c/a/2011/11/05/BAN51.DTL',
    )
    const expected = 'https://www.example.com/cgi-bin/article.cgi?f=/c/a/2011/11/05/BAN51.DTL'

    expect(unwrapWebArchive(value)).toBe(expected)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://web.archive.org/web/20240101120000id_/https://example.com/page%23top',
    )
    const expected = 'https://example.com/page#top'

    expect(unwrapWebArchive(value)).toBe(expected)
  })
})
