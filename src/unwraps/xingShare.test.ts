import { describe, expect, it } from 'bun:test'
import { unwrapXingShare } from './xingShare.js'

describe('unwrapXingShare', () => {
  it('should extract the page from /spi/shares/new', () => {
    const value = new URL(
      'https://www.xing.com/spi/shares/new?url=https%3A%2F%2Fexample.com%2F2021%2F03%2Fkonfigurationsdateien-unter-linux-suchen-mit-grep%2F',
    )
    const expected =
      'https://example.com/2021/03/konfigurationsdateien-unter-linux-suchen-mit-grep/'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page beside another param on /spi/shares/new', () => {
    const value = new URL(
      'https://www.xing.com/spi/shares/new?cb=0&url=https%3A%2F%2Fexample.com%2F2025%2F10%2F16%2Ftool-tipp-perspective-funnel-building-leicht-gemacht%2F',
    )
    const expected =
      'https://example.com/2025/10/16/tool-tipp-perspective-funnel-building-leicht-gemacht/'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page from /social_plugins/share/new', () => {
    const value = new URL(
      'https://www.xing.com/social_plugins/share/new?sc_p=xing-share&h=1&url=https%3A%2F%2Fexample.com%2Fsommarens-basta-tips-for-ett-rent-hem%2F',
    )
    const expected = 'https://example.com/sommarens-basta-tips-for-ett-rent-hem/'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract an unencoded page from /social_plugins/share/new', () => {
    const value = new URL(
      'https://www.xing.com/social_plugins/share/new?url=https://example.com/2018/02/19/a-novel-approach-for-dry-powder-coating-of-pellets-with-ethylcellulose/',
    )
    const expected =
      'https://example.com/2018/02/19/a-novel-approach-for-dry-powder-coating-of-pellets-with-ethylcellulose/'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page from /social_plugins/share', () => {
    const value = new URL(
      'https://www.xing.com/social_plugins/share?h=1&url=https%3A%2F%2Fexample.com%2Fimmobilien%2Fverwaltung%2Fuebertragung-auf-den-mieter_258_142030.html',
    )
    const expected =
      'https://example.com/immobilien/verwaltung/uebertragung-auf-den-mieter_258_142030.html'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page from /social/share/spi', () => {
    const value = new URL(
      'https://www.xing.com/social/share/spi?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page from /app/user?op=share', () => {
    const value = new URL(
      'https://www.xing.com/app/user?op=share&url=http%3A//www.example.at/presse-news/2023/06/zertifikatsverleihung-familienfreundlichegemeinde-20222023',
    )
    const expected =
      'http://www.example.at/presse-news/2023/06/zertifikatsverleihung-familienfreundlichegemeinde-20222023'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page from /app/user params separated by semicolons', () => {
    const value = new URL(
      'https://www.xing.com/app/user?op=share;url=http://example.com/2010/09/immer-diese-frage-nach-dem-wie.html;title=Immer+diese+Frage+nach+dem+Wie?;provider=Sonnenburg+News',
    )
    const expected = 'http://example.com/2010/09/immer-diese-frage-nach-dem-wie.html'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page when url comes before op on /app/user', () => {
    const value = new URL(
      'https://www.xing.com/app/user?url=https%3A%2F%2Fexample.com%2Fpost&op=share',
    )
    const expected = 'https://example.com/post'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract the page on the bare host', () => {
    const value = new URL('https://xing.com/spi/shares/new?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.xing.com/spi/shares/new?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.xing.com/SPI/Shares/New?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.xing.com/social_plugins/share?h=1')

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.xing.com/spi/shares/new?url=')

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should return undefined for another action on /app/user', () => {
    const value = new URL(
      'https://www.xing.com/app/user?op=invite&url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should return undefined for /app/user without an action', () => {
    const value = new URL('https://www.xing.com/app/user?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://www.xing.com/go/link?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should keep a dollar sign in the page from /app/user', () => {
    const value = new URL('https://www.xing.com/app/user?op=share;url=https://example.com/?q=$&')
    const expected = 'https://example.com/?q=$'

    expect(unwrapXingShare(value)).toBe(expected)
  })

  it('should return undefined for a share action on another path', () => {
    const value = new URL(
      'https://www.xing.com/app/profile?op=share&url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should not split on semicolons outside /app/user', () => {
    const value = new URL(
      'https://www.xing.com/social_plugins/share?h=1;url=https://example.com/onlinewerbung-so-werben-sie-online-erfolgreich/',
    )

    expect(unwrapXingShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/spi/shares/new?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapXingShare(value)).toBeUndefined()
  })
})
