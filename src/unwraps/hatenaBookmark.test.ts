import { describe, expect, it } from 'bun:test'
import { unwrapHatenaBookmark } from './hatenaBookmark.js'

describe('unwrapHatenaBookmark', () => {
  describe('entry page with the scheme', () => {
    it('should extract an http page', () => {
      const value = new URL('http://b.hatena.ne.jp/entry/http://example.com/blog/archives/4023')
      const expected = 'http://example.com/blog/archives/4023'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should extract an https page', () => {
      const value = new URL(
        'https://b.hatena.ne.jp/entry/https://example.com/sport/wintersport/eisschnelllauf-a-5f0efe99',
      )
      const expected = 'https://example.com/sport/wintersport/eisschnelllauf-a-5f0efe99'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should keep the page query', () => {
      const value = new URL('http://b.hatena.ne.jp/entry/http://example.com/?p=4148')
      const expected = 'http://example.com/?p=4148'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should read an escaped fragment as the page fragment', () => {
      const value = new URL(
        'https://b.hatena.ne.jp/entry/https://example.com/sport/eisschnelllauf-a-5f0efe99%23ref=rss',
      )
      const expected = 'https://example.com/sport/eisschnelllauf-a-5f0efe99#ref=rss'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })
  })

  describe('entry page with an encoded page', () => {
    it('should decode the page', () => {
      const value = new URL(
        'http://b.hatena.ne.jp/entry/http%3A%2F%2Fexample.com%2Fhamhamham000%2Fentry-11037312955.html',
      )
      const expected = 'http://example.com/hamhamham000/entry-11037312955.html'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })
  })

  describe('entry page without the scheme', () => {
    it('should give https to a page under /entry/s/', () => {
      const value = new URL(
        'https://b.hatena.ne.jp/entry/s/www.example.com/blog/26/aws4aws_cloudformation_express.html',
      )
      const expected = 'https://www.example.com/blog/26/aws4aws_cloudformation_express.html'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should give http to a page under /entry/', () => {
      const value = new URL('http://b.hatena.ne.jp/entry/example.jp/import-io')
      const expected = 'http://example.jp/import-io'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should extract a site root', () => {
      const value = new URL('https://b.hatena.ne.jp/entry/s/www.example.com/')
      const expected = 'https://www.example.com/'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })
  })

  describe('bookmark form', () => {
    it('should extract the page from /entry?url=', () => {
      const value = new URL('https://b.hatena.ne.jp/entry?url=https%3A%2F%2Fexample.com%2F')
      const expected = 'https://example.com/'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should extract the page from /add?url=', () => {
      const value = new URL(
        'http://b.hatena.ne.jp/add?mode=confirm&url=https%3A%2F%2Fexample.com%2Fxvx-mu68fujiwave%2F31344%2F&title=XVX+MU68+FujiWave',
      )
      const expected = 'https://example.com/xvx-mu68fujiwave/31344/'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should extract the page from /entry/panel/?url=', () => {
      const value = new URL(
        'http://b.hatena.ne.jp/entry/panel/?url=https://example.com/2019/04/18/windows-n-affiche-pas-le-disque-dur-externe/',
      )
      const expected = 'https://example.com/2019/04/18/windows-n-affiche-pas-le-disque-dur-externe/'

      expect(unwrapHatenaBookmark(value)).toBe(expected)
    })

    it('should return undefined without a url', () => {
      const value = new URL('http://b.hatena.ne.jp/add?mode=confirm&title=XVX+MU68+FujiWave')

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })
  })

  describe('other Hatena Bookmark pages', () => {
    it('should return undefined for the bookmark count image', () => {
      const value = new URL(
        'https://b.hatena.ne.jp/entry/image/https://example.com/sport/a-5f0efe99',
      )

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })

    it('should return undefined for the counter image', () => {
      const value = new URL('http://b.hatena.ne.jp/bc/gr/http://example.jp/')

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })

    it('should return undefined for the site entry list', () => {
      const value = new URL(
        'http://b.hatena.ne.jp/entrylist?url=http%3A%2F%2Fwww.example.com&sort=count',
      )

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })

    it('should return undefined for the comments widget', () => {
      const value = new URL(
        'http://b.hatena.ne.jp/entry.parts?url=http%3A%2F%2Fexample.jp%2Fhamhamham000%2Fentry-11037312955.html',
      )

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })

    it('should return undefined for an entry id', () => {
      const value = new URL('https://b.hatena.ne.jp/entry/4712345678901234567')

      expect(unwrapHatenaBookmark(value)).toBeUndefined()
    })
  })

  it('should return undefined for another host', () => {
    const value = new URL('https://www.hatena.ne.jp/entry/https://example.com/')

    expect(unwrapHatenaBookmark(value)).toBeUndefined()
  })
})
