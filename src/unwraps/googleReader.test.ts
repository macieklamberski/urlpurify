import { describe, expect, it } from 'bun:test'
import { unwrapGoogleReader } from './googleReader.js'

describe('unwrapGoogleReader', () => {
  describe('Fusion add link', () => {
    it('should extract a raw feedurl', () => {
      const value = new URL('http://fusion.google.com/add?feedurl=http://feed.example.com/leica')
      const expected = 'http://feed.example.com/leica'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a percent-encoded feedurl', () => {
      const value = new URL(
        'http://fusion.google.com/add?feedurl=http%3A%2F%2Ffeeds.example.com%2FCodeBetter',
      )
      const expected = 'http://feeds.example.com/CodeBetter'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a feedurl with only its scheme colon encoded', () => {
      const value = new URL('http://fusion.google.com/add?feedurl=http%3A//example.com/atom.xml')
      const expected = 'http://example.com/atom.xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a moduleurl', () => {
      const value = new URL(
        'http://fusion.google.com/add?source=atgs&moduleurl=http%3A//www.example.com/alert/gadget.xml',
      )
      const expected = 'http://www.example.com/alert/gadget.xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should prefer feedurl over moduleurl', () => {
      const value = new URL(
        'http://fusion.google.com/add?moduleurl=http://example.com/gadget.xml&feedurl=http://example.com/feed',
      )
      const expected = 'http://example.com/feed'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should return undefined without a carrier', () => {
      const value = new URL('http://fusion.google.com/add?source=atgs')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })

    it('should return undefined for /add on another Google host', () => {
      const value = new URL('http://www.google.com/add?feedurl=http://example.com/feed')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })
  })

  describe('iGoogle add link', () => {
    it('should extract a feedurl from /ig/add', () => {
      const value = new URL(
        'http://www.google.com/ig/add?feedurl=http%3A%2F%2Ffeeds.example.com%2FBuildTheChurch',
      )
      const expected = 'http://feeds.example.com/BuildTheChurch'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a moduleurl from /ig/add on fusion.google.com', () => {
      const value = new URL(
        'http://fusion.google.com/ig/add?synd=open&source=ggyp&moduleurl=http://example.com/ig/gadgets/file/101307934535771975753/genealogisch_nieuws2.xml',
      )
      const expected =
        'http://example.com/ig/gadgets/file/101307934535771975753/genealogisch_nieuws2.xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a moduleurl from /ig/adde', () => {
      const value = new URL(
        'http://www.google.com/ig/adde?moduleurl=http://example.com/news/rss/&source=imag',
      )
      const expected = 'http://example.com/news/rss/'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a feedurl from /ig/addtoreader before its url param', () => {
      const value = new URL(
        'https://www.google.com/ig/addtoreader?et=502fcf63KhHWe6Hx&source=ign_&feedurl=http://feeds2.example.com/Musi_Zhang&feedtitle=Bill_Musi_Zhang+Feeds&url=https://www.google.com/ig/add%3Ffeedurl%3Dhttp%253A%252F%252Ffeeds2.example.com%252FMusi_Zhang',
      )
      const expected = 'http://feeds2.example.com/Musi_Zhang'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a feedurl from a country host', () => {
      const value = new URL('http://www.google.co.jp/ig/add?feedurl=http://example.com/feed')
      const expected = 'http://example.com/feed'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should return undefined for another iGoogle path', () => {
      const value = new URL('http://www.google.com/ig/directory?url=http://example.com/feed')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })
  })

  describe('Reader feed path', () => {
    it('should extract a raw feed', () => {
      const value = new URL(
        'https://www.google.com/reader/view/feed/http://feeds.example.com/freeapp',
      )
      const expected = 'http://feeds.example.com/freeapp'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should decode a percent-encoded feed with its own query', () => {
      const value = new URL(
        'http://www.google.es/reader/view/feed/http%3A%2F%2Fbloc.example.com%2Fbloc%2Frss.php%3FblogId%3D9%26profile%3Drss20',
      )
      const expected = 'http://bloc.example.com/bloc/rss.php?blogId=9&profile=rss20'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should drop the Reader query after the feed', () => {
      const value = new URL(
        'http://www.google.com.au/reader/view/feed/http%3A%2F%2Fwww.example.com%2Fprofiles%2Fblog%2Ffeed%3Fxn_auth%3Dno?hl=en',
      )
      const expected = 'http://www.example.com/profiles/blog/feed?xn_auth=no'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should drop the Reader query after a raw feed', () => {
      const value = new URL(
        'https://www.google.com/reader/view/feed/http://feeds.example.com/hxp/etheadlines?hl=zh-CN',
      )
      const expected = 'http://feeds.example.com/hxp/etheadlines'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should drop the Reader fragment after the feed', () => {
      const value = new URL(
        'http://www.google.com/reader/view/feed/http%3A%2F%2Ffeeds.example.com%2FGoogleMap#stream/feed%2Fhttp%3A%2F%2Ffeeds.example.com%2FGoogleMap',
      )
      const expected = 'http://feeds.example.com/GoogleMap'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should extract a feed from the preview path', () => {
      const value = new URL(
        'http://www.google.com/reader/preview/*/feed/http%3A%2F%2Fexample.com%2F%3Fxml',
      )
      const expected = 'http://example.com/?xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'https://www.google.com/reader/view/feed/http%253A%252F%252Fexample.com%252Frss.xml',
      )
      const expected = 'http://example.com/rss.xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('https://www.google.com/Reader/View/Feed/http://example.com/rss.xml')
      const expected = 'http://example.com/rss.xml'

      expect(unwrapGoogleReader(value)).toBe(expected)
    })

    it('should return undefined for a non-http feed', () => {
      const value = new URL('https://www.google.com/reader/view/feed/ftp%3A%2F%2Fexample.com%2Frss')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })

    it('should return undefined for an empty feed path', () => {
      const value = new URL('https://www.google.com/reader/view/feed/')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })

    it('should return undefined for the Reader share link', () => {
      const value = new URL(
        'http://www.google.com/reader/link?url=http://example.com/News/archives/899&title=Explained',
      )

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })

    it('should return undefined on a lookalike host', () => {
      const value = new URL('https://www.examplegoogle.com/reader/view/feed/http://example.com/rss')

      expect(unwrapGoogleReader(value)).toBeUndefined()
    })
  })
})
