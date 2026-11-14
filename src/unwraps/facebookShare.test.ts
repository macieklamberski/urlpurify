import { describe, expect, it } from 'bun:test'
import { unwrapFacebookShare } from './facebookShare.js'

describe('unwrapFacebookShare', () => {
  it('should extract the target from sharer/sharer.php', () => {
    const value = new URL(
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com%2F%25d7%2594%25d7%259c%25d7%2591-%25d7%2591%25d7%2595%2F',
    )
    const expected = 'https://example.com/%d7%94%d7%9c%d7%91-%d7%91%d7%95/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from sharer.php', () => {
    const value = new URL(
      'https://www.facebook.com/sharer.php?api_key=120587281320910&locale=hu_HU&method=stream.share&u=https%3A%2F%2Fexample.blog.hu%2F2026%2F06%2F28%2Fszarajevoi_merenylet%3Futm_source%3Dbloghu_rss%26utm_medium%3Dfacebook',
    )
    const expected =
      'https://example.blog.hu/2026/06/28/szarajevoi_merenylet?utm_source=bloghu_rss&utm_medium=facebook'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from sharer.php on m.facebook.com', () => {
    const value = new URL(
      'https://m.facebook.com/sharer.php?u=https://example.com/2015/06/30/suspendisse-sed-sagittis/',
    )
    const expected = 'https://example.com/2015/06/30/suspendisse-sed-sagittis/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from share.php', () => {
    const value = new URL(
      'http://www.facebook.com/share.php?u=https://example.com/ca/2023/11/28/hablamos-de-humor-con-sergio-bezos',
    )
    const expected = 'https://example.com/ca/2023/11/28/hablamos-de-humor-con-sergio-bezos'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from sharer without an extension', () => {
    const value = new URL(
      'https://www.facebook.com/sharer?u=https://example.com/news-articles/strathmore-university-hosts-ai-research-dialogue/&t=Strathmore%20University%20Hosts%20AI%20Research%20Dialogue',
    )
    const expected =
      'https://example.com/news-articles/strathmore-university-hosts-ai-research-dialogue/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from sharer.php with a trailing slash', () => {
    const value = new URL(
      'http://www.facebook.com/sharer.php/?u=https://example.com/2026/07/our-team-recognized/',
    )
    const expected = 'https://example.com/2026/07/our-team-recognized/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from the legacy p[url] param', () => {
    const value = new URL(
      'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://example.com/me-hon-tran-cua-flc-tu-faros-den-dong-tien-ao-dieu/',
    )
    const expected = 'http://example.com/me-hon-tran-cua-flc-tu-faros-den-dong-tien-ao-dieu/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from a percent-encoded p[url] param', () => {
    const value = new URL(
      'https://www.facebook.com/sharer.php?s=100&p%5Btitle%5D=Die+B%C3%B6rse+immer+im+Blick&p%5Burl%5D=https%3A%2F%2Fexample.com%2Fde%2F360204%2Fusa%3Fzitat%3D360167%23zitat360167',
    )
    const expected = 'https://example.com/de/360204/usa?zitat=360167#zitat360167'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should prefer u over p[url]', () => {
    const value = new URL(
      'https://www.facebook.com/sharer.php?u=https%3A%2F%2Fexample.com%2Fpost&s=100&p[url]=https%3A%2F%2Fexample.org%2Fother',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from the share dialog', () => {
    const value = new URL(
      'https://www.facebook.com/dialog/share?app_id=200633758294132&display=popup&href=https%3A%2F%2Fexample.com%2Fteaching-learning%2Fopinion-why-doesnt-every-teacher-know%2F2018%2F10',
    )
    const expected =
      'https://example.com/teaching-learning/opinion-why-doesnt-every-teacher-know/2018/10'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from the feed dialog', () => {
    const value = new URL(
      'https://www.facebook.com/dialog/feed?app_id=1476183322618518&link=http%3A%2F%2Fexample.com%2Faopa-misrepresents-flight-sharing&picture=https%3A%2F%2Fexample.org%2Fmedium_flytenow-logo-new-square.png&name=AOPA%20Blocking%20Flight%20Sharing',
    )
    const expected = 'http://example.com/aopa-misrepresents-flight-sharing'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract the target from the send dialog over its redirect_uri', () => {
    const value = new URL(
      'http://www.facebook.com/dialog/send?app_id=891268654262273&redirect_uri=https%3A%2F%2Fexample.org%2Fdone%2F&link=https%3A%2F%2Fexample.com%2Fman-arrested-after-dropping-meth-inside-walmart-2%2F&display=popup',
    )
    const expected = 'https://example.com/man-arrested-after-dropping-meth-inside-walmart-2/'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should read href over redirect_uri in the share dialog', () => {
    const value = new URL(
      'https://facebook.com/dialog/share?app_id=220580041311284&display=page&redirect_uri=https%3A%2F%2Fexample.org%2Fdone&href=https%3A%2F%2Fexample.com%2Fblog%2Fforgiveness',
    )
    const expected = 'https://example.com/blog/forgiveness'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://www.facebook.com/sharer.php?u=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://www.facebook.com/Sharer/Sharer.php?u=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFacebookShare(value)).toBe(expected)
  })

  it('should return undefined when the u param is empty', () => {
    const value = new URL('https://www.facebook.com/sharer.php?u=&t=Title')

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })

  it('should return undefined for the share dialog with only a redirect_uri', () => {
    const value = new URL(
      'https://www.facebook.com/dialog/share?app_id=180444840287&redirect_uri=https%3A%2F%2Fexample.org%2Fdone',
    )

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })

  it('should return undefined for the feed dialog with only a redirect_uri', () => {
    const value = new URL(
      'https://www.facebook.com/dialog/feed?_path=feed&app_id=292970214170969&redirect_uri=https%3A%2F%2Fexample.org%2Fdone',
    )

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })

  it('should return undefined for the oauth dialog', () => {
    // The link= and href= params are constructed: no oauth link in the walk carries them.
    const value = new URL(
      'https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=https%3A%2F%2Fexample.org%2Fdone&link=https%3A%2F%2Fexample.com%2Fpost&href=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })

  it('should return undefined for the link shim', () => {
    const value = new URL('https://www.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/sharer/sharer.php?u=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapFacebookShare(value)).toBeUndefined()
  })
})
