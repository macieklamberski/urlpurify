import { describe, expect, it } from 'bun:test'
import { unwrapAddToMyYahoo } from './addToMyYahoo.js'

describe('unwrapAddToMyYahoo', () => {
  describe('add.my.yahoo.com/rss', () => {
    it('should extract a percent-encoded feed', () => {
      const value = new URL(
        'http://add.my.yahoo.com/rss?url=http%3A%2F%2Ffeeds.example.com%2Fmagpie2',
      )
      const expected = 'http://feeds.example.com/magpie2'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should extract a raw feed', () => {
      const value = new URL('https://add.my.yahoo.com/rss?url=https://example.com/feed/')
      const expected = 'https://example.com/feed/'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should extract a feed with only its scheme colon encoded', () => {
      const value = new URL('http://add.my.yahoo.com/rss?url=http%3A//example.com/rss')
      const expected = 'http://example.com/rss'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should decode a twice-encoded feed', () => {
      const value = new URL(
        'http://add.my.yahoo.com/rss?url=http%253A%252F%252Fexample.com%252Frss',
      )
      const expected = 'http://example.com/rss'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should match the path in any case', () => {
      const value = new URL('http://add.my.yahoo.com/RSS?url=http://example.com/rss')
      const expected = 'http://example.com/rss'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should return undefined for an empty url', () => {
      const value = new URL('http://add.my.yahoo.com/rss?url=')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })

    it('should return undefined without a url', () => {
      const value = new URL('http://add.my.yahoo.com/rss')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })

    it('should return undefined for another path', () => {
      const value = new URL('http://add.my.yahoo.com/feed?url=http://example.com/rss')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })
  })

  describe('add.my.yahoo.co.jp/rss', () => {
    it('should extract a feed with only its scheme colon encoded', () => {
      const value = new URL(
        'http://add.my.yahoo.co.jp/rss?url=http%3A//pspgos.example.net/index.rdf',
      )
      const expected = 'http://pspgos.example.net/index.rdf'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should return undefined for the content path', () => {
      const value = new URL('http://add.my.yahoo.co.jp/content?url=http://example.com/rss')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })
  })

  describe('add.my.yahoo.com/content', () => {
    it('should extract a feed after a language param', () => {
      const value = new URL(
        'http://add.my.yahoo.com/content?lg=es&url=http%3A%2F%2Ffeeds.example.com%2Fmichperu',
      )
      const expected = 'http://feeds.example.com/michperu'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should extract a raw feed after an .intl param', () => {
      const value = new URL(
        'http://add.my.yahoo.com/content?.intl=us&url=http://example.com/podcast/feed',
      )
      const expected = 'http://example.com/podcast/feed'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should return undefined for a content id', () => {
      const value = new URL('http://add.my.yahoo.com/content?id=1234')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })
  })

  describe('us.rd.yahoo.com/my redirect', () => {
    it('should extract the feed of the add link it carries', () => {
      const value = new URL(
        'http://us.rd.yahoo.com/my/atm/Livejournal%20Community%3A%20Slashcast/Slashcast/*http://add.my.yahoo.com/rss?url=http%3A//slashcast.example.com/rss',
      )
      const expected = 'http://slashcast.example.com/rss'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should extract a raw feed', () => {
      const value = new URL(
        'http://us.rd.yahoo.com/my/atm/Dragon%20Radio/Dragon%20Radio/*http://add.my.yahoo.com/rss?url=http://www.example.com/podcasts/m4a.xml',
      )
      const expected = 'http://www.example.com/podcasts/m4a.xml'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })

    it('should return undefined for an add link with a content id', () => {
      const value = new URL('http://us.rd.yahoo.com/my/*http://add.my.yahoo.com/content?id=1234')

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })

    it('should return undefined for another target', () => {
      const value = new URL(
        'http://us.rd.yahoo.com/my/atm/News/*http://news.example.com/rss?url=http://example.com/rss',
      )

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })

    it('should return undefined for another path', () => {
      const value = new URL(
        'http://us.rd.yahoo.com/customize/links/*http://add.my.yahoo.com/rss?url=http://example.com/rss',
      )

      expect(unwrapAddToMyYahoo(value)).toBeUndefined()
    })
  })

  describe('rd.yahoo.co.jp/myyahoo redirect', () => {
    it('should extract the feed of the add link it carries', () => {
      const value = new URL(
        'http://rd.yahoo.co.jp/myyahoo/rss/addtomy/users/*http://add.my.yahoo.co.jp/rss?url=http%3A//minamuranomad.example.net/index.rdf',
      )
      const expected = 'http://minamuranomad.example.net/index.rdf'

      expect(unwrapAddToMyYahoo(value)).toBe(expected)
    })
  })
})
